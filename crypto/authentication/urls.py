from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from . import views
from .views import ActivateAccountView

app_name = 'auth'

urlpatterns = [
    path('registration/', views.RegistrationView.as_view(), name="Registration"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('activate/<uuid:token>/', ActivateAccountView.as_view(), name='activate')
]