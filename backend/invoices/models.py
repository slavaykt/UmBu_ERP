from django.db import models

# Create your models here.

class Customer(models.Model):
    title = models.CharField(max_length=120)
    tax_id = models.CharField(max_length=20)
    address = models.CharField(max_length=255)

    def _str_(self):
        return self.title
