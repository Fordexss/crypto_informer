from rest_framework import serializers
from .models import CustomUser, UnverifiedUser
from django.core.mail import send_mail
from django.conf import settings
import re


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "confirm_password"]

    def validate(self, obj):
        if obj.get('password') != obj.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match.")
        return obj

    def validate_password(self, password):
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r"\d", password):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r"[a-zA-Z]", password):
            raise serializers.ValidationError("Password must contain at least one letter.")
        return password

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')

        new_unverified = UnverifiedUser(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password
        )
        new_unverified.save()

        activation_link = f"{settings.FRONTEND_URL}/activate/{new_unverified.verification_token}"

        send_mail(
            'Confirm Registration',
            f'To activate your account, please click on this link: {activation_link}',
            settings.EMAIL_HOST_USER,
            [validated_data['email']],
            fail_silently=False,
        )

        return new_unverified
