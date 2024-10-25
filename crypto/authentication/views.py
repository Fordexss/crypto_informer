from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegistrationSerializer
from .models import CustomUser, UnverifiedUser
from django.contrib.auth.hashers import make_password


class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        unverified_user = serializer.save()

        return Response(
            {"message": "Registration successful. Please check your email to verify your account."},
            status=status.HTTP_201_CREATED
        )


class ActivateAccountView(generics.GenericAPIView):
    def get(self, request, token):
        try:
            unverified_user = UnverifiedUser.objects.get(verification_token=token)

            CustomUser.objects.create(
                username=unverified_user.username,
                email=unverified_user.email,
                password=make_password(unverified_user.password),
                is_active=True,
                is_verified=True
            )

            unverified_user.delete()

            return Response(
                {"message": "Account successfully activated"},
                status=status.HTTP_200_OK
            )
        except UnverifiedUser.DoesNotExist:
            return Response(
                {"error": "Invalid activation token"},
                status=status.HTTP_400_BAD_REQUEST
            )
