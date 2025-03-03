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

    def create(self, validated_data):
        items_data = validated_data.pop("invoice_items", [])
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop("invoice_items", [])
        instance.invoice_date = validated_data.get("invoice_date", instance.invoice_date)
        instance.customer = validated_data.get("customer", instance.customer)
        instance.total_amount = validated_data.get("total_amount", instance.total_amount)
        instance.save()
        # items_data = self.context["request"].data.get("invoice_items", [])

        # Update or create invoice items
        instance.invoice_items.all().delete()  # Remove old items
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=instance, **item_data)

        return instance