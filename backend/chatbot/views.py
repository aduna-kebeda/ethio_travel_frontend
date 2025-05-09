import logging
import uuid
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer, ChatMessageSerializer

logger = logging.getLogger(__name__)

# Configure Gemini API
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Error configuring Gemini API: {str(e)}")
    raise ValueError("Failed to configure Gemini API. Check GEMINI_API_KEY.")

class ChatbotViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        tags=['Chatbot'],
        operation_summary="Send a message to the chatbot",
        operation_description="Send a message to the chatbot and receive a response. If no session_id is provided, a new conversation is created. If a session_id is provided, the conversation is continued if it belongs to the user; otherwise, a new conversation is created with a new session_id.",
        request_body=ChatMessageSerializer,
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'session_id': openapi.Schema(type=openapi.TYPE_STRING),
                    'response': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'content': openapi.Schema(type=openapi.TYPE_STRING),
                            'timestamp': openapi.Schema(type=openapi.TYPE_STRING, format='date-time')
                        }
                    )
                },
                example={
                    "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "response": {
                        "content": "Ethiopia is known for its rich history and diverse landscapes...",
                        "timestamp": "2025-05-09T11:18:08Z"
                    }
                }
            ),
            400: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)},
                example={'error': 'Invalid request data'}
            ),
            429: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)},
                example={'error': 'Rate limit exceeded. Please try again later.'}
            )
        }
    )
    @action(detail=False, methods=['post'], url_path='message', url_name='message')
    def message(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Invalid request data: {serializer.errors}")
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        message = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id')

        # Handle conversation
        if session_id:
            try:
                conversation = Conversation.objects.get(session_id=session_id)
                if conversation.user != request.user:
                    logger.warning(f"Attempted access to session_id {session_id} owned by another user")
                    # Create new conversation with new UUID
                    session_id = str(uuid.uuid4())
                    conversation = Conversation.objects.create(
                        session_id=session_id,
                        user=request.user
                    )
                    logger.info(f"Created new conversation with session_id: {session_id}")
                else:
                    logger.info(f"Continuing existing conversation with session_id: {session_id}")
            except Conversation.DoesNotExist:
                # Create new conversation with provided session_id
                conversation = Conversation.objects.create(
                    session_id=session_id,
                    user=request.user
                )
                logger.info(f"Created new conversation with provided session_id: {session_id}")
        else:
            # Create new conversation with random session_id
            session_id = str(uuid.uuid4())
            conversation = Conversation.objects.create(
                session_id=session_id,
                user=request.user
            )
            logger.info(f"Created new conversation with generated session_id: {session_id}")

        # Save user message
        user_message = Message.objects.create(
            conversation=conversation,
            content=message,
            sender='user'
        )
        logger.debug(f"Saved user message: {message[:50]}")

        # Get bot response
        bot_response = self.get_gemini_response(conversation, message)
        bot_message = Message.objects.create(
            conversation=conversation,
            content=bot_response,
            sender='bot'
        )
        logger.debug(f"Saved bot response: {bot_response[:50]}")

        return Response({
            'session_id': conversation.session_id,
            'response': {
                'content': bot_response,
                'timestamp': bot_message.created_at
            }
        })

    @swagger_auto_schema(
        tags=['Chatbot'],
        operation_summary="Get conversation history",
        operation_description="Retrieve the conversation history for a specific session",
        manual_parameters=[
            openapi.Parameter(
                'session_id',
                openapi.IN_QUERY,
                description="Session identifier",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: ConversationSerializer,
            400: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)},
                example={'error': 'session_id is required'}
            ),
            403: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)},
                example={'error': 'Conversation belongs to another user'}
            ),
            404: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'error': openapi.Schema(type=openapi.TYPE_STRING)},
                example={'error': 'Conversation not found'}
            )
        }
    )
    @action(detail=False, methods=['get'], url_path='history', url_name='history')
    def history(self, request):
        session_id = request.query_params.get('session_id')
        if not session_id:
            logger.warning("Missing session_id in history request")
            return Response(
                {'error': 'session_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            conversation = Conversation.objects.get(session_id=session_id)
            if conversation.user != request.user:
                logger.warning(f"Unauthorized access to session_id: {session_id}")
                return Response(
                    {'error': 'Conversation belongs to another user'},
                    status=status.HTTP_403_FORBIDDEN
                )
            serializer = ConversationSerializer(conversation)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            logger.warning(f"Conversation not found: {session_id}")
            return Response(
                {'error': 'Conversation not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    def get_gemini_response(self, conversation, message):
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            # Build conversation history with system instruction as first message
            history = [
                {
                    "role": "model",
                    "parts": [
                        """You are an AI travel assistant specializing in Ethiopian tourism. 
                        Provide helpful and accurate information about Ethiopia, focusing on:
                        - Tourist attractions and destinations
                        - Cultural experiences
                        - Travel tips and recommendations
                        - Local customs and traditions"""
                    ]
                }
            ] + [
                {"role": "user" if msg.sender == "user" else "model", "parts": [msg.content]}
                for msg in conversation.messages.all().order_by('created_at')
            ]
            # Add current user message
            history.append({"role": "user", "parts": [message]})
            response = model.generate_content(
                history,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": 1024,
                }
            )
            logger.info("Successfully generated Gemini response")
            return response.text

        except google_exceptions.GoogleAPIError as e:
            logger.error(f"Gemini API error: {str(e)}")
            return f"Error with the chatbot service: {str(e)}. Please try again later."
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return f"Sorry, I encountered an error: {str(e)}. Please try again later."