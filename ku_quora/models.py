from django.db import models
import uuid
from django.contrib.auth import get_user_model
User = get_user_model()
from django.utils.text import slugify
from django.urls import reverse
from notification.models  import  Notification
from django.db.models.signals import post_save,post_delete,pre_delete
import os
from core.settings import BASE_DIR


# def clean_media():
#     media = os.path.join(BASE_DIR,'media')
#     for item in os.listdir(media):
#         # if not os.listdir(os.path.join(BASE_DIR,item)):
#             # os.removedirs(os.path.join(media,item))
#         print(media)

def get_file_path(instance,filename):
    subfolder = 'postimages'
    return os.path.join(str(instance.post.user.id),subfolder,filename)




class Tag(models.Model):
    title = models.CharField(max_length = 30)
    slug = models.SlugField(null=True,unique=True,blank=True)

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('tags',args=[self.slug])
    
    def save(self,*args,**kwargs):
        self.slug = slugify(self.title)

        return super().save(*args,**kwargs)
    
class Post(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4)
    title = models.CharField(max_length=100)
    body = models.TextField()
    posted_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    slug = models.SlugField(null=False,unique=True,blank=True)

    def get_absolute_url(self):
        return reverse('post_detail',args=[self.id])

    def save(self,*args,**kwargs):
        self.slug = slugify(self.title + str(self.id))
        return super().save(*args,**kwargs)


class PostImages(models.Model):
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    image = models.ImageField(upload_to = get_file_path)
    
    # def delete(self,*args,**kwargs):
    #     print('image deleted')
        
    #     self.image.delete()
    #     super(PostImages,self).delete(*args, **kwargs)

    def deleteImage(sender,instance,*args,**kwargs):
        instance.image.delete()
        print('image deleted')
            


class Like(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_who_liked')
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='post_liked')

    def notify_like(sender,instance,*args,**kwargs):
        post = instance.post
        sender = instance.user
        user = post.user
       
        notification_type = 1

        checkDislikeNotification = Notification.objects.filter(post=post,sender=sender,user=user,notification_type=2).exists()
        if checkDislikeNotification:
            Notification.objects.filter(post=post,sender=sender,user=user,notification_type=2).delete()
        notification = Notification.objects.create(post=post,sender=sender,user=user,notification_type=notification_type)
        notification.save()
        print('like notified')



class Dislike(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE , related_name='user_who_disliked')
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='post_disliked')

    def notify_dislike(sender,instance,*args,**kwargs):
        post = instance.post
        sender = instance.user
        user = post.user
        notification_type = 2
        checkLikeNotification = Notification.objects.filter(post=post,sender=sender,user=user,notification_type=1).exists()
        if checkLikeNotification:
            Notification.objects.filter(post=post,sender=sender,user=user,notification_type=1).delete()
        notification = Notification.objects.create(post=post,sender=sender,user=user,notification_type=notification_type)
        print('dislike notified')


post_save.connect(Like.notify_like,sender=Like)
post_save.connect(Dislike.notify_dislike,sender=Dislike)
pre_delete.connect(PostImages.deleteImage,sender=PostImages)
