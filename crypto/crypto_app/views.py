from django.core.paginator import Paginator
from django.core.serializers import json
from django.http import JsonResponse
from django.contrib.auth import logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
import json
import simplejson as json
from django.views.generic import ListView, CreateView
from .helpers import *
from .forms import RegistrationForm
from django.contrib.auth import login as auth_login
from .models import CustomUser


class IndexApiView(ListView):
    paginate_by = 20

    def get(self, request, *args, **kwargs):
        try:
            top_crypto = get_top_crypto()
            if top_crypto:
                for crypto in top_crypto:
                    crypto['name'] = f"{crypto['name']} ({crypto['symbol']})"
            else:
                top_crypto = []

            paginator = Paginator(top_crypto, self.paginate_by)
            page_number = request.GET.get('page', 1)
            page_obj = paginator.get_page(page_number)

            return JsonResponse({
                'top_crypto': list(page_obj),
                'has_next': page_obj.has_next(),
                'has_previous': page_obj.has_previous(),
                'num_pages': paginator.num_pages,
                'current_page': page_obj.number,
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class CryptoNewsApiView(View):
    def get(self, request, *args, **kwargs):
        news = get_crypto_news()
        news_f_temp = [{'title': article['title'], 'url': article['url']} for article in news] if news else []
        return JsonResponse({'news': news_f_temp})


@method_decorator(csrf_exempt, name='dispatch')
class RegistrationApiView(CreateView):
    form_class = RegistrationForm
    template_name = 'registration.html'

    def form_valid(self, form):
        try:
            CustomUser.objects.get(username=form.cleaned_data['username'])
            return JsonResponse({'message': 'Username already exists'}, status=400)
        except CustomUser.DoesNotExist:
            pass

        try:
            CustomUser.objects.get(email=form.cleaned_data['email'])
            return JsonResponse({'message': 'Email already exists'}, status=400)
        except CustomUser.DoesNotExist:
            pass

        new_user = form.save(commit=False)
        new_user.is_active = True
        new_user.set_password(form.cleaned_data.get('password'))
        new_user.save()
        return JsonResponse({'message': 'User registered successfully'})

    def form_invalid(self, form):
        return JsonResponse(form.errors, status=400)


class LoginApiView(View):
    @staticmethod
    @csrf_exempt
    def as_view(request):
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'detail': 'Invalid JSON data'}, status=400)

            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'detail': 'Email and password are required'}, status=400)

            user = authenticate(request=request, email=email, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)
                    messages.success(request, 'Ви успішно увійшли в обліковий запис')
                    response = JsonResponse({'message': 'Login successful'})
                    response.set_cookie('user_id', user.id, max_age=60 * 60 * 24 * 3,
                                        domain='localhost', secure=True, samesite='Lax')
                    return response
                else:
                    return JsonResponse({'detail': 'Аккаунт не активен'}, status=400)
            else:
                return JsonResponse({'detail': 'Невірний логін або пароль'}, status=400)

        return JsonResponse({'detail': 'Method not allowed'}, status=405)


@method_decorator(login_required, name='dispatch')
class ProfileView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({'message': 'Profile view'})


@method_decorator(login_required, name='dispatch')
class LogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        response = JsonResponse({'message': 'Ви успішно вийшли з облікового запису'})
        response.delete_cookie('userLoggedIn')
        return response


# Не треба
# class ConvertView(object):
#     @staticmethod
#     def as_view(request):
#         form = ConverterForm()
#         if request.method == 'GET':
#             crypto_for_converter(form)
#             return render(request, 'convert.html', {'form': form})
#         else:
#             from_crypto = request.POST.get('from_crypto')
#             to_crypto = request.POST.get('to_crypto')
#             amount = request.POST.get('amount')
#
#             try:
#                 amount = float(amount)
#             except ValueError:
#                 messages.error(request, "Invalid amount entered. Please enter a number.")
#                 return render(request, 'convert.html', {'form': form})
#
#             price = get_crypto_price(from_crypto, to_crypto)
#
#             price_f = round(price * amount, 2)
#             message = f'Ціна {amount} {from_crypto.upper()} у {to_crypto.upper()}: {price_f} {to_crypto.upper()}'
#             messages.info(request, message, extra_tags='alert-info')
#
#             return redirect('convert')
