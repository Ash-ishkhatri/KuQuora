from django.shortcuts import render
from .models import Notification
from datetime import datetime

# Create your views here.
def notification_view(request):
    print(datetime.now())
    notifications = Notification.objects.filter(user=request.user).order_by('-date')
    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
    context = {
        'notifications':notifications,
        'notification_count':notification_count,
        'now':datetime.now()
    }

    return render(request,'notification/notification.html',context)