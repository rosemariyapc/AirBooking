from django.contrib import admin
from .models import Flight


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):

    list_display = (
        'flight_number',
        'airline',
        'departure_airport',
        'arrival_airport',
        'departure_date',
        'price',
        'available_seats',
        'status',
    )

    list_filter = ('status', 'departure_date', 'airline')

    search_fields = (
        'flight_number',
        'airline',
        'departure_airport',
        'arrival_airport',
    )
