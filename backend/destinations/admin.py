# destinations/admin.py
from django.contrib import admin
from django import forms
from .models import Destination, DestinationReview, SavedDestination

class DestinationAdminForm(forms.ModelForm):
    images = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        help_text="Enter a JSON list of image URLs, e.g., [\"url1\", \"url2\"]"
    )

    class Meta:
        model = Destination
        fields = '__all__'

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    form = DestinationAdminForm
    list_display = ('title', 'category', 'region', 'city', 'featured', 'rating', 'review_count')
    list_filter = ('category', 'region', 'featured', 'status')
    search_fields = ('title', 'description', 'address')
    readonly_fields = ('slug', 'rating', 'review_count', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'slug', 'description', 'category', 'region', 'city', 'address')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Media', {
            'fields': ('images',)
        }),
        ('Status', {
            'fields': ('featured', 'status', 'rating', 'review_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(DestinationReview)
class DestinationReviewAdmin(admin.ModelAdmin):
    list_display = ('destination', 'user', 'rating', 'title', 'helpful', 'reported')
    list_filter = ('rating', 'reported')
    search_fields = ('title', 'content')
    readonly_fields = ('helpful', 'reported', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Review Information', {
            'fields': ('destination', 'user', 'rating', 'title', 'content')
        }),
        ('Status', {
            'fields': ('helpful', 'reported')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(SavedDestination)
class SavedDestinationAdmin(admin.ModelAdmin):
    list_display = ('user', 'destination', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'destination__title')
    readonly_fields = ('created_at',)