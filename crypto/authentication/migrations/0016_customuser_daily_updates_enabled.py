# Generated by Django 5.1.2 on 2024-10-31 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0015_remove_customuser_daily_updates_enabled'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='daily_updates_enabled',
            field=models.BooleanField(default=False),
        ),
    ]
