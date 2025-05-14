from django.contrib import admin
from .models import Package, PackageReview, SavedPackage, Departure


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'display_category', 'region', 'price', 'duration',
        'difficulty', 'featured', 'rating', 'status'
    ]
    list_filter = ['region', 'featured', 'difficulty', 'status']
    search_fields = ['title', 'description', 'location', 'region']
    readonly_fields = ['slug', 'rating', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ['organizer']
    fieldsets = (
        ('Basic Information', {
            'fields': ('organizer', 'title', 'slug', 'description', 'short_description',
                       'location', 'region', 'price', 'discounted_price')
        }),
        ('Package Details', {
            'fields': ('duration', 'duration_in_days', 'image', 'gallery_images',
                       'category', 'included', 'not_included', 'itinerary')
        }),
        ('Schedule', {
            'fields': ('departure', 'departure_time', 'return_time')
        }),
        ('Requirements', {
            'fields': ('max_group_size', 'min_age', 'difficulty',
                       'tour_guide', 'languages')
        }),
        ('Additional Information', {
            'fields': ('coordinates', 'status', 'featured', 'rating')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def display_category(self, obj):
        """Display category as a comma-separated string for list_display."""
        if isinstance(obj.category, list):
            return ', '.join(obj.category)
        return obj.category
    display_category.short_description = 'Category'


@admin.register(PackageReview)
class PackageReviewAdmin(admin.ModelAdmin):
    list_display = ['package', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['package__title', 'user__username', 'comment']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['user', 'package']


@admin.register(SavedPackage)
class SavedPackageAdmin(admin.ModelAdmin):
    list_display = ['user', 'package', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'package__title']
    readonly_fields = ['created_at']
    raw_id_fields = ['user', 'package']


@admin.register(Departure)
class DepartureAdmin(admin.ModelAdmin):
    list_display = ['package', 'start_date', 'end_date', 'price', 'available_slots', 'is_guaranteed']
    list_filter = ['start_date', 'is_guaranteed']
    search_fields = ['package__title']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['package']