from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.db.models.signals import post_save,post_delete
from django.urls import reverse
from notification.models import Notification

import os,shutil
from core.settings import BASE_DIR

User = get_user_model()


def clean_media_files(sender,instance,*args,**kwargs):
    user_id = instance.id
    media = os.path.join(BASE_DIR,'media')
    for item in os.listdir(media):
        if item == str(user_id):
            shutil.rmtree(os.path.join(media,item))

# uploading profile image to media/user_id/post_images/
def get_upload_directory(instance,filename):
    subfolder = 'profile'
    if filename != None:
        return os.path.join(str(instance.user.id),subfolder,filename)



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=200,unique=True,null=False,blank=False)
    designation = models.CharField(max_length=200,null=True,blank=True)
    is_verified = models.BooleanField(default=False)
    profile_pic = models.ImageField(upload_to = get_upload_directory )
    fb_link = models.CharField(max_length=200,null=True,blank=True)
    twitter_link = models.CharField(max_length=200,null=True,blank=True)
    linkedin_link = models.CharField(max_length=200,null=True,blank=True)
    
    def __str__(self):
        return self.token
    
    def save_profile(sender,instance,*args,**kwargs):
        try:
            profile = Profile(user = instance ,profile_pic = 'default/defaultProfile.png', token=str(uuid.uuid1()))
            profile.save()
            print('saved profile')
        except Exception as e:
            print('error',e)
    
    def get_profile_url(self):
        print('inside')
        return (os.path.join(str(self.id),'profile',str(self.profile_pic)))
        

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
# post_save.connect(Profile.configure_image_path,sender=Profile)

post_delete.connect(clean_media_files , sender=User)