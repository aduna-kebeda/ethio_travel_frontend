from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()


def default_json_list():
    """Serializable default for JSONField."""
    return []


class Package(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Moderate', 'Moderate'),
        ('Challenging', 'Challenging'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
    ]

    id = models.AutoField(primary_key=True)
    organizer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='packages',
        null=False,
        default="967315d1-ead0-4cdf-b4f2-9b5945a5ccf2",  # Default UUID
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=300)
    location = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    duration = models.CharField(max_length=50)
    duration_in_days = models.IntegerField()
    image = models.CharField(max_length=200, blank=True)
    gallery_images = models.JSONField(default=default_json_list)
    category = models.JSONField(default=default_json_list)
    included = models.JSONField(default=default_json_list)
    not_included = models.JSONField(default=default_json_list)
    itinerary = models.JSONField(default=default_json_list)
    departure = models.CharField(max_length=100)
    departure_time = models.TimeField()
    return_time = models.TimeField()
    max_group_size = models.IntegerField()
    min_age = models.IntegerField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    tour_guide = models.CharField(max_length=100)
    languages = models.JSONField(default=default_json_list)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    coordinates = models.JSONField(default=default_json_list, blank=True, null=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='draft'
    )
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Package.objects.filter(slug=slug).exclude(id=self.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['region']),
            models.Index(fields=['featured']),
            models.Index(fields=['status']),
        ]


class PackageReview(models.Model):
    id = models.AutoField(primary_key=True)
    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name='reviews',
        null=False,
        default=1,  # Default package ID
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='package_reviews',
        null=False,
        default="967315d1-ead0-4cdf-b4f2-9b5945a5ccf2",  # Default user UUID
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    comment = models.TextField(default="", blank=True)
    helpful = models.BooleanField(default=False)  # Added field
    reported = models.BooleanField(default=False)  # Added field
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        package_name = self.package.title
        user_name = self.user.username
        return f"Review by {user_name} for {package_name}"

    class Meta:
        unique_together = ['package', 'user']
        indexes = [
            models.Index(fields=['package']),
            models.Index(fields=['user']),
            models.Index(fields=['rating']),
            models.Index(fields=['helpful']),  # Optional: index for filtering
            models.Index(fields=['reported']),  # Optional: index for filtering
        ]


class SavedPackage(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='saved_packages',
        null=False,
        default="967315d1-ead0-4cdf-b4f2-9b5945a5ccf2",  # Default user UUID
    )
    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name='saved_by',
        null=False,
        default=1,  # Default package ID
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        package_name = self.package.title
        user_name = self.user.username
        return f"{user_name} saved {package_name}"

    class Meta:
        unique_together = ['user', 'package']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['package']),
        ]


class Departure(models.Model):
    id = models.AutoField(primary_key=True)
    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name='departures',
        null=False,
        default=1,  # Default package ID
    )
    start_date = models.DateField(default="2025-01-01")
    end_date = models.DateField(default="2025-01-01")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    available_slots = models.IntegerField(default=0)
    is_guaranteed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        package_name = self.package.title
        date = self.start_date.strftime('%Y-%m-%d') if self.start_date else 'No date'
        return f"{package_name} - {date}"

    class Meta:
        ordering = ['start_date']
        indexes = [
            models.Index(fields=['start_date']),
            models.Index(fields=['is_guaranteed']),
        ]