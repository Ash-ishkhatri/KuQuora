from django.shortcuts import render,redirect,get_object_or_404
from .models import Post,Tag,Like,Dislike, Answer
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from notification.models import Notification

@login_required(login_url='login')
def index_view(request):
    
    posts = Post.objects.all().order_by('-posted_on')
    liked_post_ids = []
    liked_objs = Like.objects.filter(user=request.user).all()
    for liked_obj in liked_objs:
        liked_post_ids.append(liked_obj.post.id)
        print(liked_obj.post.id)
    disliked_post_ids = []
    disliked_objs = Dislike.objects.filter(user=request.user).all()
    for disliked_obj in disliked_objs:
        disliked_post_ids.append(disliked_obj.post.id)

    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
    context = {
        'posts':posts,
        'liked_posts_ids':liked_post_ids,
        'disliked_posts_ids':disliked_post_ids,
        'notification_count':notification_count
    }
    return render(request,'ku_quora/index.html',context)


def create_post_view(request):
    if request.method == 'POST':
        user = request.user
        tags_objs = []
        title = request.POST.get('title')
        body = request.POST.get('body')
        tags = request.POST.get('tags')
        tags_list = list(tags.split(' '))

        print(tags_list)
        for tag in tags_list:
            t, created = Tag.objects.get_or_create(title=tag)
            tags_objs.append(t)
        
        p, created = Post.objects.get_or_create(title=title,body=body,user=user)
        p.tags.set(tags_objs)
        return redirect('index')

def post_detail_view(request,post_id):

    post = get_object_or_404(Post,id = post_id)
    liked_post_ids = []
    liked_objs = Like.objects.filter(user=request.user).all()
    for liked_obj in liked_objs:
        liked_post_ids.append(liked_obj.post.id)
        print(liked_obj.post.id)
    disliked_post_ids = []
    disliked_objs = Dislike.objects.filter(user=request.user).all()
    for disliked_obj in disliked_objs:
        disliked_post_ids.append(disliked_obj.post.id)
    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
 
    answers = Answer.objects.filter(post=post)

    context = {
        'post':post,
        'liked_posts_ids':liked_post_ids,
        'disliked_posts_ids':disliked_post_ids,
        'notification_count':notification_count,
        'answers' : answers
    }
    return render(request,'ku_quora/post_detail.html',context)


def tags_post_view(request,tag_slug):
    liked_post_ids = []
    liked_objs = Like.objects.filter(user=request.user).all()
    for liked_obj in liked_objs:
        liked_post_ids.append(liked_obj.post.id)
        print(liked_obj.post.id)
    disliked_post_ids = []
    disliked_objs = Dislike.objects.filter(user=request.user).all()
    for disliked_obj in disliked_objs:
        disliked_post_ids.append(disliked_obj.post.id)
    tag = get_object_or_404(Tag,slug=tag_slug)
    posts = Post.objects.filter(tags=tag).order_by('-posted_on')
    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()

    context = {
        'posts':posts,
        'tag':tag,
        'liked_posts_ids':liked_post_ids,
        'disliked_posts_ids':disliked_post_ids,
        'notification_count':notification_count
    }
    return render(request,'ku_quora/tag_post.html',context)




def like_post_view(request):
    if request.method == 'POST':
        user = request.user
        data = json.loads(request.body)
        post_id = data['post_id']

        post = Post.objects.get(id=post_id)
        likes = post.likes
        dislikes = post.dislikes

        already_liked = Like.objects.filter(user = user , post=post).exists()
        already_disliked = Dislike.objects.filter(user = user , post=post).exists()

        if already_liked:
            Like.objects.filter(user=user,post=post).delete()
            likes -= 1
        
        if already_disliked:
            Dislike.objects.filter(user=user,post=post).delete()
            dislikes -= 1
        
        if not already_liked:
            Like.objects.create(user=user,post=post)
            likes += 1

        post.likes = likes
        post.dislikes = dislikes
        post.save()

        response = {
            'current_likes':likes,
            'current_dislikes':dislikes
        }            

        return JsonResponse(response)
    return redirect('index')



def dislike_post_view(request):
    if request.method == 'POST':
        user = request.user
        data = json.loads(request.body)
        post_id = data['post_id']

        post = Post.objects.get(id=post_id)
        likes = post.likes
        dislikes = post.dislikes

        already_liked = Like.objects.filter(user = user , post=post).exists()
        already_disliked = Dislike.objects.filter(user = user , post=post).exists()

        if already_liked:
            Like.objects.filter(user=user,post=post).delete()
            likes -= 1
        
        if already_disliked:
            Dislike.objects.filter(user=user,post=post).delete()
            dislikes -= 1
        
        if not already_disliked:
            Dislike.objects.create(user=user,post=post)
            dislikes += 1

        post.likes = likes
        post.dislikes = dislikes
        post.save()

        response = {
            'current_likes':likes,
            'current_dislikes':dislikes
        }            

        return JsonResponse(response)
    return redirect('index')

def AnswerView(request):
    if request.method == "POST":
        answer=request.POST.get('answer')
        user=request.user
        postSno =request.POST.get('postSno')
        post= Post.objects.get(id=postSno)
        answer=Answer(answer= answer, user=user, post=post)
        answer.save()
        return redirect(f"/{post.id}")        
        


def CommentView(request):
    if request.method == "POST":
        comment=request.POST.get('comment')
        user=request.user
        CmtSno =request.POST.get('CmtSno')
        answer= Answer.objects.get(ansId=CmtSno)
        comment=Comment(comment= comment, user=user, answer=answer)
        comment.save()
        
    return redirect(f"/{post.slug}")        

