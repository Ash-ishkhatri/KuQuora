from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()
# Create your models here.
class Notification(models.Model):
    NOTIFICATION_TYPES = ((1,'like'),(2,'follow'),(3,'post'))

    post = models.ForeignKey('ku_quora.Post', on_delete=models.CASCADE,blank=True,null=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE,related_name='notification_from')
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='notification_to')
    notification_type = models.IntegerField(choices=NOTIFICATION_TYPES,default=0,blank=False,null=False)
    date = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)

    
