from django.urls import path
from .views import (
    FlightListView,
    FlightDetailView,
    AdminFlightListCreateView,
    AdminFlightDetailView,
    AdminFlightStatusUpdateView
)

urlpatterns = [
    path('search/', FlightListView.as_view(), name='flight-search'),

    path('<int:pk>/', FlightDetailView.as_view(), name='flight-detail'),

    path('admin/', AdminFlightListCreateView.as_view(), name='admin-flight-list-create'),

    path('admin/<int:pk>/', AdminFlightDetailView.as_view(), name='admin-flight-detail'),

    path('admin/<int:pk>/status/', AdminFlightStatusUpdateView.as_view(), name='admin-flight-status-update'),
]