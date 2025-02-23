from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from invoices import views

router = routers.DefaultRouter()
router.register(r'customers', views.CustomerView, 'customer')
router.register(r"invoices", views.InvoiceViewSet, basename="invoice")
router.register(r"invoice-items", views.InvoiceItemViewSet, basename="invoice-item")
router.register(r"items", views.ItemViewSet, basename="item")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]