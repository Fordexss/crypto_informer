from django.contrib.admin.templatetags.admin_list import pagination
from django.urls import path
from . import views
from .paginators import CryptoPaginator

urlpatterns = [
    path('api/index/', views.IndexApiView.as_view(), name='index_api'),
    path('api/news/', views.CryptoNewsApiView.as_view(), name='crypto_news_api'),
    path('api/tracked-currencies/', views.TrackedCurrencyList.as_view(
        pagination_class = CryptoPaginator
    ), name='tracked-currencies'),
    path('api/tracked-currencies-help/', views.TrackedCurrencyList.as_view(), name='tracked-currencies'),
    path('api/tracked-currencies/<int:currency_id>/', views.TrackedCurrencyDestroy.as_view(), name='tracked-currencies')
]