from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import CustomerProfile

class CustomerProfileInline(admin.StackedInline):
    model = CustomerProfile
    can_delete = False
    verbose_name_plural = 'Customer Profile'

class UserAdmin(BaseUserAdmin):
    inlines = (CustomerProfileInline,)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
