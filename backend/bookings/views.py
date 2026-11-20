from rest_framework import generics, status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import transaction

from .models import Booking
from .serializers import BookingSerializer
from flights.models import Flight
from rest_framework.permissions import IsAdminUser


class BookingListCreateView(generics.ListCreateAPIView):

    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        ).select_related('flight')

    def create(self, request, *args, **kwargs):

        flight_id = request.data.get('flight')
        seats = request.data.get('seats_booked')

        try:
            seats = int(seats)
        except (TypeError, ValueError):
            raise ValidationError({
                'seats_booked': 'Enter a valid number of seats.'
            })

        if seats <= 0:
            raise ValidationError({
                'seats_booked': 'Seats must be greater than zero.'
            })

        with transaction.atomic():

            try:
                flight = Flight.objects.select_for_update().get(
                    id=flight_id
                )
            except (Flight.DoesNotExist, ValueError, TypeError):
                raise ValidationError({
                    'flight': 'Flight not found.'
                })

            if flight.available_seats < seats:
                raise ValidationError({
                    'seats_booked': 'Not enough seats available.'
                })

            total_price = flight.price * seats

            booking = Booking.objects.create(
                user=request.user,
                flight=flight,
                seats_booked=seats,
                total_price=total_price
            )

            flight.available_seats -= seats
            flight.save(update_fields=['available_seats'])

        serializer = self.get_serializer(booking)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            user=self.request.user
        ).select_related('flight')

class BookingCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        with transaction.atomic():
            booking = get_object_or_404(
                Booking.objects.select_for_update(),
                pk=pk,
                user=request.user
            )

            if booking.status == 'cancelled':
                return Response(
                    {'message': 'Booking is already cancelled.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            flight = Flight.objects.select_for_update().get(
                id=booking.flight_id
            )

            booking.status = 'cancelled'
            booking.save(update_fields=['status'])

            flight.available_seats += booking.seats_booked
            flight.save(update_fields=['available_seats'])

        return Response(
            {'message': 'Booking cancelled successfully.'},
            status=status.HTTP_200_OK
        )


class BookingPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        booking = get_object_or_404(
            Booking,
            pk=pk,
            user=request.user
        )

        if booking.status == 'cancelled':
            return Response(
                {'error': 'Cannot pay for a cancelled booking.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.payment_status == 'paid':
            return Response(
                {'message': 'Payment has already been completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_method = request.data.get('payment_method')

        valid_methods = ['upi', 'card', 'netbanking']

        if payment_method not in valid_methods:
            return Response(
                {'error': 'Invalid payment method.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Simulate successful payment
        booking.payment_method = payment_method
        booking.payment_status = 'paid'
        booking.save(
            update_fields=['payment_method', 'payment_status']
        )

        return Response({
            'message': 'Payment successful.',
            'pnr': booking.pnr,
            'payment_method': booking.payment_method,
            'payment_status': booking.payment_status,
            'amount_paid': booking.total_price
        }, status=status.HTTP_200_OK)

class AdminBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Booking.objects.select_related(
            'user',
            'flight'
        ).all().order_by('-booking_date')



# Crte your views here.
