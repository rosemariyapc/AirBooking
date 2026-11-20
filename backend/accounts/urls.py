
from django.urls import path
from .views import (
    RegisterView,
    CustomLoginView,
    PendingUsersView,
    ApproveUserView,
    RejectUserView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),

    path('admin/users/pending/', PendingUsersView.as_view(), name='pending-users'),
    path('admin/users/<int:pk>/approve/', ApproveUserView.as_view(), name='approve-user'),
    path('admin/users/<int:pk>/reject/', RejectUserView.as_view(), name='reject-user'),
]