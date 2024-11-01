from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_active', 'is_staff', 'is_superuser', 'daily_updates_enabled', 'last_login')
    search_fields = ('email', 'username')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'daily_updates_enabled', 'last_login')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'verification_token')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Email Updates', {'fields': ('daily_updates_enabled',)}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    readonly_fields = ('verification_token', 'last_login')

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password', 'is_active', 'is_staff', 'is_superuser', 'daily_updates_enabled')
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)