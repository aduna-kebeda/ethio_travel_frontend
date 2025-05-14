from rest_framework import permissions


class IsPackageOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS) for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        # Require authentication for non-safe methods (POST, PUT, DELETE)
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow safe methods for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow staff or the package organizer to modify
        return request.user.is_staff or obj.organizer == request.user


class IsReviewOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow safe methods for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        # Require authentication for non-safe methods
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow safe methods for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow the review owner to modify
        return obj.user == request.user