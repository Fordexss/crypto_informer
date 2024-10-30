from rest_framework import serializers
from .models import CustomUser
from django.core.mail import send_mail
from django.conf import settings


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "confirm_password", "is_active"]
        read_only_fields = ['is_active']

    def validate(self, obj):
        if obj.get('password') != obj.get('confirm_password'):
            raise serializers.ValidationError("Passwords do not match.")
        return obj

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()

        activation_link = f"{settings.FRONTEND_URL}/activate/{user.verification_token}"

        send_mail(
            'Confirm Registration',
            f'To activate your account, please click on this link: {activation_link}',
            settings.EMAIL_HOST_USER,
            [validated_data['email']],
            fail_silently=False,
        )

        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'weekly_updates_enabled']