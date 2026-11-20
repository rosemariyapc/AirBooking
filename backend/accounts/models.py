
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    APPROVAL_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    approval_status = models.CharField(
        max_length=10,
        choices=APPROVAL_CHOICES,
        default='pending'
    )

    def __str__(self):
        return self.username


# Create your models here.
