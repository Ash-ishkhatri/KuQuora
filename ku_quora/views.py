from django.shortcuts import render,redirect,get_object_or_404
from .models import Post,Tag,PostImages
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from notification.models import Notification
from saved.models import SavedPosts

@login_required(login_url='login')
def index_view(request):
    
    posts = Post.objects.all().order_by('-posted_on')

    saved_post_ids = []
    saved_objs = SavedPosts.objects.filter(user = request.user).all()
    for obj in saved_objs:
        saved_post_ids.append(obj.post.id)

    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
    images = PostImages.objects.all()
    context = {
        'posts':posts,
        'notification_count':notification_count,
        'images':images,
        'saved_post_ids':saved_post_ids,
    }
    return render(request,'ku_quora/index.html',context)


def create_post_view(request):
    if request.method == 'POST':
        user = request.user
        tags_objs = []
        title = request.POST.get('title')
        body = request.POST.get('body')
        tags = request.POST.get('tags')
        images = request.FILES.getlist('image1')
        tags_list = list(tags.split(' '))
        for tag in tags_list:
            t, created = Tag.objects.get_or_create(title=tag)
            tags_objs.append(t)
        p, created = Post.objects.get_or_create(title=title,body=body,user=user)
        p.tags.set(tags_objs)
        for image in images:
            i, created = PostImages.objects.get_or_create(post=p,image=image)
        return redirect('index')

def post_detail_view(request,post_id):
    post = get_object_or_404(Post,id = post_id)
    saved_post_ids = []
    saved_objs = SavedPosts.objects.filter(user = request.user).all()
    for obj in saved_objs:
        saved_post_ids.append(obj.post.id)
    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
    p = Post.objects.get(id=post_id)
    images = PostImages.objects.filter(post=p)
    context = {
        'post':post,
        'notification_count':notification_count,
        'images':images,
        'saved_post_ids':saved_post_ids,

    }
    return render(request,'ku_quora/post_detail.html',context)


def tags_post_view(request,tag_slug):
    saved_post_ids = []
    saved_objs = SavedPosts.objects.filter(user = request.user).all()
    for obj in saved_objs:
        saved_post_ids.append(obj.post.id)
    
    tag = get_object_or_404(Tag,slug=tag_slug)
    posts = Post.objects.filter(tags=tag).order_by('-posted_on')
    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
    images = PostImages.objects.all()
    context = {
        'posts':posts,
        'tag':tag,
        'notification_count':notification_count,
        'saved_post_ids':saved_post_ids,
        'images':images
    }
    return render(request,'ku_quora/tag_post.html',context)


def delete_post_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        post_id = data['post_id']
        Post.objects.filter(id = post_id).delete()
        
        response = {
            'deleted':True
        }            

        return JsonResponse(response)
    return redirect('index')

