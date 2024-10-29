from django.db import models
from django.conf import settings


class TrackedCurrency(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tracked_currencies")
    currency_id = models.IntegerField()

    def __str__(self):
        return f"{self.user}, {self.currency_id}"