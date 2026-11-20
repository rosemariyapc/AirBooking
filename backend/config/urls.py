
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/', include('accounts.urls')),

    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/flights/', include('flights.urls')),

    path('api/bookings/', include('bookings.urls')),

    path('api/admin/', include('accounts.admin_urls')),
]
