from rest_framework import generics, permissions

from .serializers import RegistrationSerializer, UserSerializer
from .models import CustomUser


class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    queryset = CustomUser.objects.all()
    permission_classes = []


class ActivateAccountView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer
    lookup_field = 'verification_token'
    lookup_url_kwarg = 'token'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = True
        instance.save()
        return super().retrieve(request, *args, **kwargs)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user