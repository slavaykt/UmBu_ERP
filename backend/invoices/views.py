from django.shortcuts import render
from rest_framework import viewsets
from .serializers import CustomerSerializer, InvoiceSerializer
from .models import Customer, Invoice

# Create your views here.

class CustomerView(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
