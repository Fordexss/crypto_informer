import os
import requests
from dotenv import load_dotenv
from .forms import ConverterForm

load_dotenv()

API_KEY = os.getenv('API_KEY')
API_KEY2 = os.getenv('API_KEY2')
url_crypto = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
url_listing = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'


def get_crypto_data(symbol):
    parameters = {
        'symbol': symbol.upper(),
    }

    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': API_KEY,
    }

    response = requests.get(url_crypto, headers=headers, params=parameters)
    if response.status_code == 200:
        data = response.json()
        return data['data'].get(symbol.upper())
    else:
        return None


def get_crypto_price(base, symbol='USD'):
    if base is None or symbol is None:
        print("Ошибка: Параметры 'base' или 'symbol' не могут быть None")
        return None

    try:
        parameters = {
            'symbol': base.upper(),
            'convert': symbol.upper()
        }
        headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': API_KEY,
        }
        response = requests.get(url_crypto, headers=headers, params=parameters)
        response.raise_for_status()
        data = response.json()
        base_upper = base.upper()
        symbol_upper = symbol.upper()
        if 'data' in data and base_upper in data['data'] and 'quote' in data['data'][base_upper] and symbol_upper in \
                data['data'][base_upper]['quote']:
            price = data['data'][base_upper]['quote'][symbol_upper]['price']
            return round(price, 10)
        else:
            print(f"Ошибка: Неверный ответ от API или валюта '{base_upper}' не найдена.")
            return None

    except requests.exceptions.RequestException as e:
        print(f"Ошибка при получении данных: {e}")
        return None


def get_top_crypto():
    parameters = {
        'limit': 100
    }

    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': API_KEY,
    }

    response = requests.get(url_listing, headers=headers, params=parameters)
    if response.status_code == 200:
        data = response.json()
        return data.get('data', [])
    else:
        return []


def custom_enumerate(iterable, start=0):
    return enumerate(iterable, start=start)


def get_crypto_news():
    url_news = 'https://cryptopanic.com/api/v1/posts/'
    params = {
        'auth_token': API_KEY2,
        'filter': 'hot',
        'public': 'true',
    }
    response = requests.get(url_news, params=params)
    data = response.json()
    return data['results']


# def crypto_for_converter(form: ConverterForm):
#     top_crypto = get_top_crypto()
#     if top_crypto:
#         form.fields['from_crypto'].choices = [(crypto['symbol'], crypto['name']) for crypto in top_crypto]
#         form.fields['to_crypto'].choices = [(crypto['symbol'], crypto['name']) for crypto in top_crypto]
