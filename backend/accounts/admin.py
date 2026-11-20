
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'approval_status',
        'is_staff',
    )

    list_filter = ('approval_status', 'is_staff')

    fieldsets = UserAdmin.fieldsets + (
        ('Account Approval', {
            'fields': ('approval_status',)
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Account Approval', {
            'fields': ('approval_status',)
        }),
    )


# Register your models here.
