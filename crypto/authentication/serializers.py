from rest_framework import serializers

from .models import CustomUser


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "confirm_password"]

    def validate(self, obj):
        if obj.get('password') != obj.get('confirm_password'):
            raise serializers.ValidationError("Бро, чєкни паролі, вони ж різні")

    def create(self, validated_data):
        validated_data.pop('confirm password')

        new_user = CustomUser.objects.create_user(
            email = validated_data['email'],
            username = validated_data['username'],
            password = validated_data['password']
        )
        new_user.save()
        return new_user



