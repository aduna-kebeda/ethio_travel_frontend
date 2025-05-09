# Gemini API Configuration
import os
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') or 'AIzaSyA1UrmzkSiv573BCirl_eJ3mIsKBaTnlXQ'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party apps
    'rest_framework',
    'corsheaders',
    'drf_yasg',
    
    # Local apps
    'packages.apps.PackagesConfig',
    'chatbot.apps.ChatbotConfig',
]

# Swagger settings
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    },
    'USE_SESSION_AUTH': False,
    'JSON_EDITOR': True,
    'OPERATIONS_SORTER': 'alpha',
    'TAGS_SORTER': 'alpha',
    'DOC_EXPANSION': 'none',
    'DEFAULT_MODEL_RENDERING': 'example',
    'DEFAULT_INFO': 'backend.urls.schema_view',
    'VALIDATOR_URL': None,
    'PERSIST_AUTH': True,
    'REFETCH_SCHEMA_WITH_AUTH': True,
    'REFETCH_SCHEMA_ON_LOGOUT': True,
} 