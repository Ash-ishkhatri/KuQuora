from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.db.models.signals import post_save
from django.urls import reverse
from notification.models import Notification

User = get_user_model()



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=200,unique=True,null=False,blank=False)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.token
    
    def save_profile(sender,instance,*args,**kwargs):
        try:
            profile = Profile(user = instance,token=str(uuid.uuid1()))
            profile.save()
            print('saved profile')
        except Exception as e:
            print('error',e)
    

class Follow(models.Model):
    following = models.ForeignKey(User, on_delete=models.CASCADE,related_name='following')
    follower = models.ForeignKey(User, on_delete=models.CASCADE,related_name='follower')

    def notify_follow(sender,instance,*args,**kwargs):
        sender = instance.follower
        user = instance.following
        notification_type = 3
        notification = Notification(sender=sender,user=user,notification_type=notification_type)
        notification.save()
        print('follow notified')


post_save.connect(Profile.save_profile,sender=User)
post_save.connect(Follow.notify_follow,sender=Follow)