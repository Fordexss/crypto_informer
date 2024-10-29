from celery import shared_task
from django.core.mail import send_mail
from authentication.models import CustomUser
from .models import TrackedCurrency
from .helpers import get_top_crypto


@shared_task
def send_weekly_updates():
    users = CustomUser.objects.filter(weekly_updates_enabled=True)

    crypto_data = get_top_crypto()

    for user in users:
        subject = 'Weekly changes'
        message = 'Changes in your favorite cryptocurrencies:\n\n'

        tracked_currencies = TrackedCurrency.objects.filter(user=user)

        for tracked in tracked_currencies:
            crypto_info = next((crypto for crypto in crypto_data if crypto['id'] == tracked.currency_id), None)
            if crypto_info:
                message += (
                    f"{crypto_info['name']} ({crypto_info['symbol']}): "
                    f"${crypto_info['quote']['USD']['price']} "
                    f"(Рыночная капитализация: ${crypto_info['quote']['USD']['market_cap']}) "
                    f"(Изменение 1ч: {crypto_info['quote']['USD']['percent_change_1h']}%, "
                    f"24ч: {crypto_info['quote']['USD']['percent_change_24h']}%, "
                    f"7д: {crypto_info['quote']['USD']['percent_change_7d']}%)\n"
                )

        send_mail(
            subject,
            message,
            'cryptoinformer887@gmail.com',
            [user.email],
            fail_silently=False,
        )