from rest_framework import serializers
from .models import Invoice, InvoiceItem, Item, Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ('id','title', 'tax_id', 'address')

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name", "price"]

class InvoiceItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)

    class Meta:
        model = InvoiceItem
        fields = ["id", "invoice", "item", "item_name", "quantity", "price", "amount"]

class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.title", read_only=True)
    invoice_items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ["id", "invoice_date", "customer", "customer_name", "total_amount", "invoice_items"]