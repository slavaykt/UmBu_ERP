from django.db import models
from django.utils import timezone

# Create your models here.

class Customer(models.Model):
    title = models.CharField(max_length=120)
    tax_id = models.CharField(max_length=20)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Invoice(models.Model):
    invoice_date = models.DateTimeField(default=timezone.now)  # Import timezone
    customer = models.ForeignKey("Customer", on_delete=models.CASCADE, related_name="invoices", null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)  # ✅ Ensures two decimal places

    def __str__(self):
        return f"Invoice {self.id} from {self.invoice_date.strftime('%Y-%m-%d %H:%M:%S')} - {self.customer.title if self.customer else 'No Customer'} - ${self.total_amount}"
    
class Item(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price per unit in USD

    def __str__(self):
        return self.name

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="invoice_items")
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at the time of invoice
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Quantity * Price

    def save(self, *args, **kwargs):
        self.amount = self.quantity * self.price  # Auto-calculate amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.item.name} in Invoice {self.invoice.id}"