from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'pnr',
        'user',
        'flight',
        'seats_booked',
        'total_price',
        'status',
        'booking_date',
    )

    list_filter = ('status', 'booking_date')

    search_fields = (
        'pnr',
        'user__username',
        'flight__flight_number',
    )


from django.contrib import admin

# Register your models here.
