from rest_framework import serializers

from .models import TrackedCurrency


class IndexSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    symbol = serializers.CharField()
    quote = serializers.DictField()


class TrackCurrencySerializer(serializers.ModelSerializer):
    currency_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = TrackedCurrency
        fields = ["id", "user", "currency_id"]
        read_only_fields = ["id", "user", "currency_id"]

    def validate(self, attrs):
        user = self.context['request'].user
        currency_id = attrs['currency_id']

        if TrackedCurrency.objects.filter(user=user, currency_id=currency_id).exists():
            raise serializers.ValidationError(
                {"currency_id":"Currency already Tracking"}
            )
        return attrs

    def create(self, validated_data):
        tracked_currency = TrackedCurrency.objects.create(
            user=self.context["request"].user,
            currency_id=validated_data["currency_id"]
        )
        return tracked_currency

    # def delete(self, attrs):
    #     TrackedCurrency.objects.get(
    #         user=self.context["request"].user,
    #         currency_id=attrs["currency_id"]
    #     ).delete()
