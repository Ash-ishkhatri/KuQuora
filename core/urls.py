
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('ku_quora.urls')),
    path('account/',include('account.urls')),
    path('notification/',include('notification.urls'))
]
