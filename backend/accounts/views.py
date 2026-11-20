
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .serializers import RegisterSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from .models import User
from flights.models import Flight
from bookings.models import Booking


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            'message': 'Registration successful. Your account is awaiting admin approval.',
            'username': user.username,
            'approval_status': user.approval_status
        }, status=status.HTTP_201_CREATED)

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PendingUsersView(generics.ListAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(
            approval_status='pending',
            is_staff=False
        )

class ApproveUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound('User not found.')

        user.approval_status = 'approved'
        user.save(update_fields=['approval_status'])

        return Response({
            'message': 'User approved successfully.',
            'username': user.username,
            'approval_status': user.approval_status
        }, status=status.HTTP_200_OK)

class RejectUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound('User not found.')

        user.approval_status = 'rejected'
        user.save(update_fields=['approval_status'])

        return Response({
            'message': 'User rejected successfully.',
            'username': user.username,
            'approval_status': user.approval_status
        }, status=status.HTTP_200_OK)
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.filter(is_staff=False).count()

        pending_users = User.objects.filter(
            approval_status='pending',
            is_staff=False
        ).count()

        total_flights = Flight.objects.count()

        total_bookings = Booking.objects.count()

        return Response({
            'total_users': total_users,
            'pending_users': pending_users,
            'total_flights': total_flights,
            'total_bookings': total_bookings,
        })
class AllUsersView(generics.ListAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(
            is_staff=False
        ).order_by('-date_joined')
# Create your views here.
