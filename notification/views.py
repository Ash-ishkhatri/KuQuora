from django.shortcuts import render
from .models import Notification
from datetime import datetime
import json
from django.http import JsonResponse

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


def getLatestNotification_view(request):

    data = json.loads(request.body)
    oldCount = data['currentNotificationCount']


    print(type(oldCount))

    newCount = Notification.objects.filter(user=request.user).count()
    
    currentNotificationCount = 0
    oldCount = int(oldCount)
    if newCount > oldCount:
        currentNotificationCount = newCount
    else:
        currentNotificationCount = oldCount
    response = {
        'currentNotificationCount':currentNotificationCount
    }
    return JsonResponse(response)
