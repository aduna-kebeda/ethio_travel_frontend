from rest_framework import viewsets, status, filters, permissions, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Destination, DestinationReview, SavedDestination
from .serializers import (
    DestinationSerializer, DestinationDetailSerializer,
    DestinationReviewSerializer, SavedDestinationSerializer
)
from .permissions import IsDestinationOwnerOrReadOnly, IsReviewOwnerOrReadOnly
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'region', 'city', 'featured', 'status']
    search_fields = ['title', 'description', 'city']
    ordering_fields = ['rating', 'review_count', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return DestinationDetailSerializer
        return DestinationSerializer

    def get_permissions(self):
        # Allow admins to perform any action
        if self.request.user and self.request.user.is_staff:
            return [IsAuthenticated()]
        # For non-admins, apply owner-based permissions
        if self.action in ['create']:
            return [IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy', 'toggle_featured', 'toggle_status']:
            return [IsAuthenticated(), IsDestinationOwnerOrReadOnly()]
        return []

    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.filter(status='active')
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="List all active destinations",
        responses={200: DestinationSerializer(many=True)},
        manual_parameters=[
            openapi.Parameter('category', openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by category"),
            openapi.Parameter('region', openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by region"),
            openapi.Parameter('city', openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by city"),
            openapi.Parameter('featured', openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description="Filter by featured status"),
            openapi.Parameter('status', openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Filter by status"),
            openapi.Parameter('search', openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Search by title, description, or city"),
            openapi.Parameter('ordering', openapi.IN_QUERY, type=openapi.TYPE_STRING, description="Order by rating, review_count, or created_at"),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Retrieve a single destination",
        responses={200: DestinationDetailSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Create a new destination",
        request_body=DestinationSerializer,
        responses={201: DestinationSerializer, 400: "Bad Request", 401: "Unauthorized"}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Update a destination",
        request_body=DestinationSerializer,
        responses={200: DestinationSerializer, 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden"}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Partially update a destination",
        request_body=DestinationSerializer,
        responses={200: DestinationSerializer, 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden"}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Delete a destination",
        responses={204: "No Content", 401: "Unauthorized", 403: "Forbidden"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Add a review to a destination",
        request_body=DestinationReviewSerializer,
        responses={
            201: DestinationReviewSerializer,
            400: openapi.Response(description="Bad Request", examples={"application/json": {"error": "You have already reviewed this destination"}}),
            401: "Unauthorized"
        }
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, pk=None):
        destination = self.get_object()
        if destination.reviews.filter(user=request.user).exists():
            return Response(
                {'error': 'You have already reviewed this destination'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = DestinationReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(destination=destination, user=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="List reviews for a destination",
        manual_parameters=[
            openapi.Parameter('sort_by', openapi.IN_QUERY, type=openapi.TYPE_STRING, enum=['rating', 'helpful', 'created_at'], description="Sort reviews by rating, helpful count, or creation date")
        ],
        responses={200: DestinationReviewSerializer(many=True)}
    )
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        destination = self.get_object()
        reviews = destination.reviews.all()
        sort_by = request.query_params.get('sort_by', 'created_at')
        if sort_by in ['rating', 'helpful', 'created_at']:
            reviews = reviews.order_by(f'-{sort_by}')
        serializer = DestinationReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Toggle the featured status of a destination",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={'featured': openapi.Schema(type=openapi.TYPE_BOOLEAN)}
                )
            ),
            401: "Unauthorized",
            403: "Forbidden"
        }
    )
    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        destination = self.get_object()
        destination.featured = not destination.featured
        destination.save()
        return Response({'featured': destination.featured})

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Cycle through the status of a destination (draft -> active -> inactive)",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={'status': openapi.Schema(type=openapi.TYPE_STRING)}
                )
            ),
            401: "Unauthorized",
            403: "Forbidden"
        }
    )
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        destination = self.get_object()
        status_cycle = {'draft': 'active', 'active': 'inactive', 'inactive': 'draft'}
        destination.status = status_cycle.get(destination.status, 'draft')
        destination.save()
        return Response({'status': destination.status})

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Save a destination to the user's saved list",
        responses={
            201: SavedDestinationSerializer,
            400: openapi.Response(description="Bad Request", examples={"application/json": {"error": "Destination is already saved"}}),
            401: "Unauthorized"
        }
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        destination = self.get_object()
        saved_destination, created = SavedDestination.objects.get_or_create(
            user=self.request.user, destination=destination
        )
        if not created:
            return Response({'error': 'Destination is already saved'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = SavedDestinationSerializer(saved_destination)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Remove a destination from the user's saved list",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={'message': openapi.Schema(type=openapi.TYPE_STRING)}
                )
            ),
            400: openapi.Response(description="Bad Request", examples={"application/json": {"error": "Destination is not saved"}}),
            401: "Unauthorized"
        }
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def unsave(self, request, pk=None):
        destination = self.get_object()
        deleted, _ = SavedDestination.objects.filter(user=self.request.user, destination=destination).delete()
        if deleted:
            return Response({'message': 'Destination removed from saved list'})
        return Response({'error': 'Destination is not saved'}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="List the user's saved destinations",
        responses={200: SavedDestinationSerializer(many=True), 401: "Unauthorized"}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def saved(self, request):
        saved_destinations = SavedDestination.objects.filter(user=self.request.user)
        serializer = SavedDestinationSerializer(saved_destinations, many=True)
        return Response(serializer.data)

class DestinationReviewViewSet(viewsets.ModelViewSet):
    serializer_class = DestinationReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return DestinationReview.objects.none()
        return DestinationReview.objects.filter(destination_id=self.kwargs.get('destination_pk'))

    def perform_create(self, serializer):
        if getattr(self, 'swagger_fake_view', False):
            return
        destination = get_object_or_404(Destination, pk=self.kwargs.get('destination_pk'))
        serializer.save(user=self.request.user, destination=destination)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="List reviews for a specific destination",
        responses={200: DestinationReviewSerializer(many=True)}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Retrieve a specific review for a destination",
        responses={200: DestinationReviewSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Create a new review for a destination",
        request_body=DestinationReviewSerializer,
        responses={201: DestinationReviewSerializer, 400: "Bad Request", 401: "Unauthorized"}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Update a review for a destination",
        request_body=DestinationReviewSerializer,
        responses={200: DestinationReviewSerializer, 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden"}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Partially update a review for a destination",
        request_body=DestinationReviewSerializer,
        responses={200: DestinationReviewSerializer, 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden"}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Delete a review for a destination",
        responses={204: "No Content", 401: "Unauthorized", 403: "Forbidden"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Mark review as helpful",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={'helpful': openapi.Schema(type=openapi.TYPE_INTEGER)}
                )
            )
        }
    )
    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, destination_pk=None, pk=None):
        review = self.get_object()
        review.helpful += 1
        review.save()
        return Response({'helpful': review.helpful})

    @swagger_auto_schema(
        tags=['Destinations'],
        operation_description="Report a review",
        responses={
            200: openapi.Response(
                description="Success",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={'reported': openapi.Schema(type=openapi.TYPE_BOOLEAN)}
                )
            )
        }
    )
    @action(detail=True, methods=['post'])
    def report(self, request, destination_pk=None, pk=None):
        review = self.get_object()
        review.reported = True
        review.save()
        return Response({'reported': review.reported})

class SavedDestinationViewSet(viewsets.ModelViewSet):
    queryset = SavedDestination.objects.all()
    serializer_class = SavedDestinationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return SavedDestination.objects.none()
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        if getattr(self, 'swagger_fake_view', False):
            return
        destination = get_object_or_404(Destination, pk=self.request.data.get('destination'))
        if SavedDestination.objects.filter(user=self.request.user, destination=destination).exists():
            raise serializers.ValidationError('Destination is already saved')
        serializer.save(user=self.request.user, destination=destination)

    @swagger_auto_schema(
        tags=['Saved Destinations'],
        operation_description="List the user's saved destinations",
        responses={200: SavedDestinationSerializer(many=True), 401: "Unauthorized"}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Saved Destinations'],
        operation_description="Retrieve a specific saved destination",
        responses={200: SavedDestinationSerializer, 401: "Unauthorized"}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Saved Destinations'],
        operation_description="Create a new saved destination",
        request_body=SavedDestinationSerializer,
        responses={
            201: SavedDestinationSerializer,
            400: openapi.Response(description="Bad Request", examples={"application/json": {"detail": "Destination is already saved"}}),
            401: "Unauthorized"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Saved Destinations'],
        operation_description="Update a saved destination",
        request_body=SavedDestinationSerializer,
        responses={200: SavedDestinationSerializer, 400: "Bad Request", 401: "Unauthorized"}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Saved Destinations'],
        operation_description="Partially update a saved destination",
        request_body=SavedDestinationSerializer,
        responses={200: SavedDestinationSerializer, 400: "Bad Request", 401: "Unauthorized"}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Saved Destinations'],
        operation_description="Delete a saved destination",
        responses={204: "No Content", 401: "Unauthorized"}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)