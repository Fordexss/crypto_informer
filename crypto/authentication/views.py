from rest_framework.generics import (
    CreateAPIView
)


from .serializers import RegistrationSerializer


class RegistrationView(CreateAPIView):
    serializer_class = RegistrationSerializer


