# Generated by Django 5.1.2 on 2024-10-27 10:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0012_delete_unverifieduser_customuser_verification_token'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='is_verified',
        ),
    ]
