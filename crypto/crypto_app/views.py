from rest_framework.generics import (
    ListCreateAPIView,
    ListAPIView,
    DestroyAPIView
)
from rest_framework.permissions import IsAuthenticated

from .paginators import CryptoPaginator
from .serializers import (
    IndexSerializer,
    TrackCurrencySerializer,
    CryptoNewsSerializer
)
from .helpers import get_top_crypto, get_crypto_news
from .models import TrackedCurrency


class IndexApiView(ListCreateAPIView):
    queryset = get_top_crypto()
    pagination_class = CryptoPaginator

    def get_serializer_class(self):
        if self.request.method == "GET":
            return IndexSerializer
        else:
            return TrackCurrencySerializer


class TrackedCurrencyList(ListAPIView):
    serializer_class = IndexSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        tracked_currencies = TrackedCurrency.objects.filter(user=self.request.user)
        data = get_top_crypto()
        filtered_data = []

        for tracked_currency in tracked_currencies:
            currency_id = tracked_currency.currency_id
            for currency in data:
                if currency.get("id") == currency_id:
                    filtered_data.append(currency)
        return filtered_data


class TrackedCurrencyDestroy(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TrackCurrencySerializer
    lookup_field = "currency_id"

    def get_queryset(self):
        return TrackedCurrency.objects.filter(user=self.request.user)


class CryptoNewsApiView(ListAPIView):
    queryset = get_crypto_news()
    serializer_class = CryptoNewsSerializer