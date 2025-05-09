from rest_framework import serializers
from .models import Package, PackageReview, SavedPackage, Departure
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = fields
        ref_name = 'PackageUserSerializer'

class PackageReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PackageReview
        fields = [
            'id', 'package', 'user', 'rating', 'comment',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def create(self, validated_data):
        return super().create(validated_data)

class PackageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = [
            'id', 'title', 'slug', 'category', 'location', 'region',
            'price', 'discounted_price', 'duration', 'duration_in_days',
            'image', 'gallery_images', 'rating', 'featured'
        ]
        read_only_fields = ['id', 'slug', 'rating']

class SavedPackageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    package = PackageListSerializer(read_only=True)
    
    class Meta:
        model = SavedPackage
        fields = ['id', 'user', 'package', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        return super().create(validated_data)

class DepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departure
        fields = ['id', 'package', 'start_date', 'end_date', 'price', 'available_slots', 'is_guaranteed']
        read_only_fields = ['id']

class PackageDetailSerializer(PackageListSerializer):
    reviews = PackageReviewSerializer(many=True, read_only=True)
    departures = DepartureSerializer(many=True, read_only=True)
    
    class Meta(PackageListSerializer.Meta):
        fields = PackageListSerializer.Meta.fields + [
            'description', 'short_description', 'included', 'not_included',
            'itinerary', 'departure', 'departure_time', 'return_time',
            'max_group_size', 'min_age', 'difficulty', 'tour_guide',
            'languages', 'coordinates', 'status', 'reviews', 'departures'
        ]
        read_only_fields = PackageListSerializer.Meta.read_only_fields + [
            'status', 'created_at', 'updated_at'
        ]

class PackageSerializer(PackageListSerializer):
    class Meta(PackageListSerializer.Meta):
        fields = PackageListSerializer.Meta.fields + [
            'description', 'short_description', 'included', 'not_included',
            'itinerary', 'departure', 'departure_time', 'return_time',
            'max_group_size', 'min_age', 'difficulty', 'tour_guide',
            'languages', 'coordinates', 'status'
        ]
        read_only_fields = PackageListSerializer.Meta.read_only_fields

    def validate(self, data):
        # Convert string coordinates to list
        if 'coordinates' in data and isinstance(data['coordinates'], str):
            try:
                # Extract numbers from string like "9.1450° N, 40.4897° E"
                coords = data['coordinates'].replace('°', '').replace('N', '').replace('E', '').split(',')
                lat = float(coords[0].strip())
                lon = float(coords[1].strip())
                data['coordinates'] = [lat, lon]
            except:
                raise serializers.ValidationError("Invalid coordinates format")

        # Convert string lists to actual lists
        for field in ['category', 'gallery_images', 'included', 'not_included', 'itinerary', 'languages']:
            if field in data and isinstance(data[field], str):
                if field == 'category':
                    data[field] = [data[field]]
                elif field == 'gallery_images':
                    data[field] = data[field].split(',')
                elif field in ['included', 'not_included']:
                    data[field] = [item.strip() for item in data[field].split(',')]
                elif field == 'itinerary':
                    data[field] = [item.strip() for item in data[field].split(';')]
                elif field == 'languages':
                    data[field] = [data[field]]

        # Convert price strings to numbers
        if 'price' in data and isinstance(data['price'], str):
            try:
                data['price'] = float(data['price'].replace('USD', '').strip())
            except:
                raise serializers.ValidationError("Invalid price format")

        if 'discounted_price' in data and isinstance(data['discounted_price'], str):
            try:
                data['discounted_price'] = float(data['discounted_price'].replace('USD', '').split('(')[0].strip())
            except:
                raise serializers.ValidationError("Invalid discounted price format")

        # Convert time strings to proper time format
        if 'departure_time' in data and isinstance(data['departure_time'], str):
            if 'Morning' in data['departure_time']:
                data['departure_time'] = '08:00:00'
            elif 'Evening' in data['departure_time']:
                data['departure_time'] = '18:00:00'

        if 'return_time' in data and isinstance(data['return_time'], str):
            if 'Morning' in data['return_time']:
                data['return_time'] = '08:00:00'
            elif 'Evening' in data['return_time']:
                data['return_time'] = '18:00:00'

        # Validate coordinates
        if 'coordinates' in data and len(data['coordinates']) == 2:
            lat, lon = data['coordinates']
            if not -90 <= lat <= 90:
                raise serializers.ValidationError("Latitude must be between -90 and 90")
            if not -180 <= lon <= 180:
                raise serializers.ValidationError("Longitude must be between -180 and 180")

        return data

    def create(self, validated_data):
        return super().create(validated_data)