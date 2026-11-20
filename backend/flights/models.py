from django.db import models


class Flight(models.Model):
    STATUS_CHOICES = [
        ('on_time', 'On Time'),
        ('delayed', 'Delayed'),
        ('cancelled', 'Cancelled'),
    ]

    airline = models.CharField(max_length=100)
    flight_number = models.CharField(max_length=20, unique=True)

    departure_airport = models.CharField(max_length=100)
    arrival_airport = models.CharField(max_length=100)

    departure_date = models.DateField()
    departure_time = models.TimeField()
    arrival_time = models.TimeField()

    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_seats = models.PositiveIntegerField()
    available_seats = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='on_time'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.flight_number} - {self.airline}"




# Create your models here.
