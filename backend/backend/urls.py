from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from invoices import views

router = routers.DefaultRouter()
router.register(r'customers', views.CustomerView, 'customer')
router.register(r"invoices", views.InvoiceViewSet, basename="invoice")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]