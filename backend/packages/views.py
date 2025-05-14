from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Package, PackageReview, SavedPackage, Departure
from .serializers import (
    PackageSerializer, PackageListSerializer, PackageDetailSerializer,
    PackageReviewSerializer, SavedPackageSerializer, DepartureSerializer
)
from .filters import PackageFilter
from .permissions import IsPackageOwnerOrReadOnly

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PackageFilter
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'created_at', 'updated_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'toggle_status']:
            return [IsAuthenticated(), IsPackageOwnerOrReadOnly()]
        if self.action == 'toggle_featured':
            return [IsAdminUser()]
        if self.action in ['save', 'unsave', 'add_review', 'my_packages']:
            return [IsAuthenticated()]
        return []

    def get_serializer_class(self):
        if self.action == 'list':
            return PackageListSerializer
        elif self.action == 'retrieve':
            return PackageDetailSerializer
        return PackageSerializer

    def get_queryset(self):
        if self.action == 'list':
            return self.queryset.filter(status='active')
        if self.action == 'my_packages':
            return self.queryset.filter(organizer=self.request.user)
        return self.queryset

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Create a new tour package",
        responses={
            201: PackageSerializer,
            400: "Bad Request"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="List all active tour packages",
        responses={
            200: PackageListSerializer(many=True)
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Retrieve details of a specific tour package",
        responses={
            200: PackageDetailSerializer,
            404: "Not Found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Update a tour package",
        request_body=PackageSerializer,
        responses={
            200: PackageSerializer,
            400: "Bad Request",
            404: "Not Found"
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Delete a tour package",
        responses={
            204: "No Content",
            404: "Not Found"
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Toggle featured status of a package",
        responses={
            200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'featured': openapi.Schema(type=openapi.TYPE_BOOLEAN)
            }),
            403: "Permission Denied"
        }
    )
    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        package = self.get_object()
        package.featured = not package.featured
        package.save()
        return Response({'featured': package.featured})

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Toggle status of a package between active and draft",
        responses={
            200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'status': openapi.Schema(type=openapi.TYPE_STRING)
            }),
            403: "Permission Denied"
        }
    )
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        package = self.get_object()
        package.status = 'draft' if package.status == 'active' else 'active'
        package.save()
        return Response({'status': package.status})

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Save a package for the authenticated user",
        responses={
            201: SavedPackageSerializer,
            400: "Package is already saved",
            401: "Authentication Required"
        }
    )
    @action(detail=True, methods=['post'])
    def save(self, request, pk=None):
        package = self.get_object()
        saved_package, created = SavedPackage.objects.get_or_create(
            package=package,
            user=request.user
        )
        if not created:
            return Response(
                {'error': 'Package is already saved'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = SavedPackageSerializer(saved_package)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Remove a package from the authenticated user's saved list",
        responses={
            200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }),
            400: "Package is not saved",
            401: "Authentication Required"
        }
    )
    @action(detail=True, methods=['post'])
    def unsave(self, request, pk=None):
        package = self.get_object()
        deleted, _ = SavedPackage.objects.filter(
            package=package,
            user=request.user
        ).delete()
        if deleted:
            return Response({'message': 'Package removed from saved list'})
        return Response(
            {'error': 'Package is not saved'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Get list of featured packages",
        responses={
            200: PackageListSerializer(many=True)
        }
    )
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_packages = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(featured_packages, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Get list of packages created by the authenticated user",
        responses={
            200: PackageListSerializer(many=True),
            401: "Authentication Required"
        }
    )
    @action(detail=False, methods=['get'])
    def my_packages(self, request):
        my_packages = self.get_queryset()
        serializer = self.get_serializer(my_packages, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        tags=['Package Reviews'],
        operation_description="Get all reviews for a specific package",
        responses={
            200: PackageReviewSerializer(many=True)
        }
    )
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        package = self.get_object()
        reviews = package.reviews.all()
        serializer = PackageReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        tags=['Package Reviews'],
        operation_description="Add a review to a package",
        request_body=PackageReviewSerializer,
        responses={
            201: PackageReviewSerializer,
            400: "Bad Request",
            401: "Authentication Required"
        }
    )
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        package = self.get_object()
        if package.reviews.filter(user=request.user).exists():
            return Response(
                {'error': 'You have already reviewed this package'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = PackageReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(package=package, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Get list of all package categories",
        responses={
            200: openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING))
        }
    )
    @action(detail=False, methods=['get'])
    def categories(self, request):
        categories = Package.objects.values_list('category', flat=True).distinct()
        # Flatten the list in case category is stored as a list
        flattened_categories = []
        for cat_list in categories:
            if isinstance(cat_list, list):
                flattened_categories.extend(cat_list)
            else:
                flattened_categories.append(cat_list)
        return Response(list(set(flattened_categories)))

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Get list of all package regions",
        responses={
            200: openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING))
        }
    )
    @action(detail=False, methods=['get'])
    def regions(self, request):
        regions = Package.objects.values_list('region', flat=True).distinct()
        return Response(list(set(regions)))

class PackageReviewViewSet(viewsets.ModelViewSet):
    serializer_class = PackageReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return PackageReview.objects.none()
        return PackageReview.objects.filter(package_id=self.kwargs.get('package_pk'))

    def perform_create(self, serializer):
        package = get_object_or_404(Package, pk=self.kwargs.get('package_pk'))
        if package.reviews.filter(user=self.request.user).exists():
            raise serializers.ValidationError('You have already reviewed this package')
        serializer.save(package=package, user=self.request.user)

    @swagger_auto_schema(
        tags=['Package Reviews'],
        operation_description="Mark a review as helpful",
        responses={
            200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'helpful': openapi.Schema(type=openapi.TYPE_INTEGER)
            }),
            401: "Authentication Required"
        }
    )
    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        review = self.get_object()
        review.helpful += 1
        review.save()
        return Response({'helpful': review.helpful})

    @swagger_auto_schema(
        tags=['Package Reviews'],
        operation_description="Report a review",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'reason': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={
            200: openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }),
            401: "Authentication Required"
        }
    )
    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        review = self.get_object()
        review.reported = True
        review.report_reason = request.data.get('reason', '')
        review.save()
        return Response({'message': 'Review reported successfully'})

class SavedPackageViewSet(viewsets.ModelViewSet):
    queryset = SavedPackage.objects.all()
    serializer_class = SavedPackageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return SavedPackage.objects.none()
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        package = get_object_or_404(Package, pk=self.kwargs.get('package_pk'))
        if SavedPackage.objects.filter(package=package, user=self.request.user).exists():
            raise serializers.ValidationError('Package is already saved')
        serializer.save(package=package, user=self.request.user)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="Create a saved package",
        request_body=SavedPackageSerializer,
        responses={
            201: SavedPackageSerializer,
            400: "Bad Request",
            401: "Authentication Required"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['Tour Packages'],
        operation_description="List saved packages",
        responses={
            200: SavedPackageSerializer(many=True),
            401: "Authentication Required"
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class DepartureViewSet(viewsets.ModelViewSet):
    serializer_class = DepartureSerializer
    permission_classes = []

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Departure.objects.none()
        return Departure.objects.filter(package_id=self.kwargs.get('package_pk'))