from django.urls import path
from . import views

urlpatterns = [
    path('api/index/', views.IndexApiView.as_view(), name='index_api'),
    path('api/news/', views.CryptoNewsApiView.as_view(), name='crypto_news_api'),
    path('api/tracked-currencies/', views.TrackedCurrencyList.as_view(), name='tracked-currencies'),
    path('api/tracked-currencies/<int:currency_id>/', views.TrackedCurrencyDestroy.as_view(), name='tracked-currencies')
]