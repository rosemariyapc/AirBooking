
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.exceptions import NotFound

from .models import Flight
from .serializers import FlightSerializer


class FlightListView(generics.ListAPIView):
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Flight.objects.filter(
            departure_date__gte=timezone.localdate(),
            available_seats__gt=0
        )

        departure = self.request.query_params.get('departure')
        destination = self.request.query_params.get('destination')
        date = self.request.query_params.get('date')

        if departure:
            queryset = queryset.filter(
                departure_airport__icontains=departure
            )

        if destination:
            queryset = queryset.filter(
                arrival_airport__icontains=destination
            )

        if date:
            queryset = queryset.filter(departure_date=date)

        return queryset

class FlightDetailView(generics.RetrieveAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]

class AdminFlightListCreateView(generics.ListCreateAPIView):
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Flight.objects.all().order_by('-departure_date')

class AdminFlightDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [IsAdminUser]

class AdminFlightStatusUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            flight = Flight.objects.get(pk=pk)
        except Flight.DoesNotExist:
            raise NotFound('Flight not found.')

        new_status = request.data.get('status')

        valid_statuses = ['on_time', 'delayed', 'cancelled']

        if new_status not in valid_statuses:
            return Response(
                {'error': 'Invalid flight status.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        flight.status = new_status
        flight.save(update_fields=['status'])

        return Response({
            'message': 'Flight status updated successfully.',
            'flight_number': flight.flight_number,
            'status': flight.status
        }, status=status.HTTP_200_OK)