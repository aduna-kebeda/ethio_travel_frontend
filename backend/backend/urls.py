from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from core.views import api_root

schema_view = get_schema_view(
    openapi.Info(
        title="Tour Package API",
        default_version='v1',
        description="API for managing tour packages and chatbot interactions",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/packages/', include('packages.urls')),
    path('api/chatbot/', include('chatbot.urls', namespace='chatbot')),
    path('api/users/', include('users.urls')),
    path('api/destinations/', include('destinations.urls')),
    path('api/events/', include('events.urls')),
    path('api/business/', include('business.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/booking/', include('booking.urls')),
    
    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 