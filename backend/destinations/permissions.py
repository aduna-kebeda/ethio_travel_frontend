# destinations/permissions.py
from rest_framework import permissions

class IsDestinationOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow authenticated users to create destinations
        # Admins bypass role checks
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Admins can perform any action
        if request.user.is_staff:
            return True
        # Otherwise, only the owner can modify
        return obj.user == request.user

class IsReviewOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Admins can modify any review
        if request.user.is_staff:
            return True
        return obj.user == request.user