# Generated by Django 5.1.2 on 2024-10-23 16:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crypto_app', '0004_alter_trackedcurrency_currency'),
    ]

    operations = [
        migrations.RenameField(
            model_name='trackedcurrency',
            old_name='currency',
            new_name='currency_id',
        ),
    ]