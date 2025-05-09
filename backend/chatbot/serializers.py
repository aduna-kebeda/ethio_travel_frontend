from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'sender', 'created_at']
        read_only_fields = ['id', 'created_at']
        swagger_schema_fields = {
            "example": {
                "id": 1,
                "content": "Tell me about Ethiopian culture",
                "sender": "user",
                "created_at": "2025-05-09T11:13:47Z"
            }
        }

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'session_id', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['id', 'created_at', 'updated_at']
        swagger_schema_fields = {
            "example": {
                "id": 1,
                "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "created_at": "2025-05-09T11:13:47Z",
                "updated_at": "2025-05-09T11:14:00Z",
                "messages": [
                    {
                        "id": 1,
                        "content": "Hello! Ethiopia is known for its ancient history...",
                        "sender": "bot",
                        "created_at": "2025-05-09T11:13:47Z"
                    },
                    {
                        "id": 2,
                        "content": "Tell me about Ethiopian culture",
                        "sender": "user",
                        "created_at": "2025-05-09T11:13:50Z"
                    }
                ]
            }
        }

class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField(
        required=True,
        help_text="The message to send to the chatbot",
        style={'base_template': 'textarea.html'}
    )
    session_id = serializers.UUIDField(
        required=False,
        help_text="Optional session ID for continuing a conversation",
        format='hex_verbose'
    )

    class Meta:
        swagger_schema_fields = {
            "example": {
                "message": "Tell me about Ethiopian culture",
                "session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
        }