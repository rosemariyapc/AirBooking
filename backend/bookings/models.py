
import uuid
from django.db import models
from django.conf import settings
from flights.models import Flight


def generate_pnr():
    return uuid.uuid4().hex[:10].upper()


class Booking(models.Model):
    BOOKING_STATUS = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    PAYMENT_METHODS = [
        ('upi', 'UPI'),
        ('card', 'Credit/Debit Card'),
        ('netbanking', 'Net Banking'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    flight = models.ForeignKey(
        Flight,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    pnr = models.CharField(
        max_length=10,
        unique=True,
        default=generate_pnr
    )

    seats_booked = models.PositiveIntegerField()

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=BOOKING_STATUS,
        default='confirmed'
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='pending'
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        blank=True,
        null=True
    )

    booking_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pnr
