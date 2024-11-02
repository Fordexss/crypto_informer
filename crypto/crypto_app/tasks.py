from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from authentication.models import CustomUser
from .models import TrackedCurrency
from .helpers import get_top_crypto


@shared_task
def send_daily_updates():
    users = CustomUser.objects.filter(daily_updates_enabled=True)
    crypto_data = get_top_crypto()

    for user in users:
        tracked_currencies = TrackedCurrency.objects.filter(user=user)
        user_crypto_data = []

        for tracked in tracked_currencies:
            crypto_info = next((crypto for crypto in crypto_data if crypto['id'] == tracked.currency_id), None)
            if crypto_info:
                user_crypto_data.append(crypto_info)

        if user_crypto_data:
            subject = 'Daily Crypto Updates'
            html_message = render_to_string('daily_update_email.html', {'crypto_data': user_crypto_data})

            send_mail(
                subject,
                '',
                'cryptoinformer887@gmail.com',
                [user.email],
                fail_silently=False,
                html_message=html_message,
            )