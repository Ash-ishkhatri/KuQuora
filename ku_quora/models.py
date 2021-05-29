from django.db import models
import uuid
from django.contrib.auth import get_user_model
User = get_user_model()
from django.utils.text import slugify
from django.urls import reverse
from notification.models  import  Notification
from django.db.models.signals import post_save


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
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
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
        return reverse('post_detail',args=[str(self.id)])

    def save(self,*args,**kwargs):
        self.slug = slugify(self.title)
        return super().save(*args,**kwargs)

class Like(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_who_liked')
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='post_liked')

    def notify_like(sender,instance,*args,**kwargs):
        post = instance.post
        sender = instance.user
        user = post.user
        notification_type = 1
        notification, created = Notification.objects.get_or_create(post=post,sender=sender,user=user,notification_type=notification_type)
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
        notification, created = Notification.objects.get_or_create(post=post,sender=sender,user=user,notification_type=notification_type)
        notification.save()
        print('dislike notified')


post_save.connect(Like.notify_like,sender=Like)
post_save.connect(Dislike.notify_dislike,sender=Dislike)
