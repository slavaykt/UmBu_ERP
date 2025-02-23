from django.contrib import admin
from .models import Customer, Invoice

class CustomerAdmin(admin.ModelAdmin):
    list_display = ('title', 'tax_id', 'address')

class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_date', 'customer', 'total_amount')

admin.site.register(Customer, CustomerAdmin)
admin.site.register(Invoice, InvoiceAdmin)
