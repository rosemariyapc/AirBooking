from django.urls import path
from bookings.views import AdminBookingListView
from .views import (
    PendingUsersView,
    ApproveUserView,
    RejectUserView,
    AdminDashboardStatsView,
    AllUsersView
)

urlpatterns = [
    path('users/pending/', PendingUsersView.as_view(), name='pending-users'),
    path('users/<int:pk>/approve/', ApproveUserView.as_view(), name='approve-user'),
    path('users/<int:pk>/reject/', RejectUserView.as_view(), name='reject-user'),
path('dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
path('users/', AllUsersView.as_view(), name='all-users'),
path('bookings/', AdminBookingListView.as_view(), name='admin-bookings'),
]