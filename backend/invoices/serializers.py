from rest_framework import serializers
from .models import Customer, Invoice

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id','title', 'tax_id', 'address')

class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.title", read_only=True)  # Show customer name in response

    class Meta:
        model = Invoice
        fields = ["id", "invoice_date", "customer", "customer_name", "total_amount"]