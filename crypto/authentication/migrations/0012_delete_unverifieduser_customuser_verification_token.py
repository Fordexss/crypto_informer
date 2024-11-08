# Generated by Django 5.1.2 on 2024-10-26 13:38

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0011_remove_unverifieduser_created_at'),
    ]

    operations = [
        migrations.DeleteModel(
            name='UnverifiedUser',
        ),
        migrations.AddField(
            model_name='customuser',
            name='verification_token',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]
