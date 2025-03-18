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
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    invoice_items = InvoiceItemSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ["id", "invoice_date", "customer", "total_amount", "invoice_items"]

    def create(self, validated_data):
        items_data = validated_data.pop("invoice_items", [])
        invoice = Invoice.objects.create(**validated_data)
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        return invoice

    def update(self, instance, validated_data):
        items_data = validated_data.pop("invoice_items", [])
        for field in ['invoice_date', 'customer', 'total_amount']:
            setattr(instance, field, validated_data.get(field, getattr(instance, field)))
        instance.save()
        # items_data = self.context["request"].data.get("invoice_items", [])

        # Update or create invoice items
        instance.invoice_items.all().delete()  # Remove old items
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=instance, **item_data)

        return instance