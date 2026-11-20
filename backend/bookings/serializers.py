
from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    flight_details = serializers.StringRelatedField(
        source='flight',
        read_only=True
    )

    user_name = serializers.CharField(
        source='user.username',
        read_only=True
    )

    flight_number = serializers.CharField(
        source='flight.flight_number',
        read_only=True
    )

    departure_airport = serializers.CharField(
        source='flight.departure_airport',
        read_only=True
    )

    arrival_airport = serializers.CharField(
        source='flight.arrival_airport',
        read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id',
            'pnr',
            'user',
            'user_name',
            'flight',
            'flight_details',
            'flight_number',
            'departure_airport',
            'arrival_airport',
            'seats_booked',
            'total_price',
            'status',
            'payment_status',
            'payment_method',
            'booking_date',
        ]

        read_only_fields = [
            'id',
            'pnr',
            'user',
            'total_price',
            'status',
            'payment_status',
            'booking_date',
        ]
