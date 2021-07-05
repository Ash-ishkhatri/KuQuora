from django.shortcuts import render,redirect,get_object_or_404
from .models import Post,Tag,PostImages,Answer,AnswerImages
from django.contrib.auth.decorators import login_required
import json
from django.http import JsonResponse
from notification.models import Notification
from saved.models import SavedPosts
from django.core.paginator import Paginator, EmptyPage , PageNotAnInteger
from django.core import serializers

@login_required(login_url='login')
def index_view(request):
    
    posts = Post.objects.all().order_by('-posted_on')

    # p = Paginator(posts,2)
    # page = request.GET.get('page')
    # try:
    #     posts = p.page(page)
    # except PageNotAnInteger:
    #     posts = p.page(1)
    # except EmptyPage:
    #     posts = p.page(p.num_pages)

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
    
    answers = Answer.objects.filter(post=post).order_by('-time')
    answerImages = []
    UpVotedAnswerIds = []


    for answer in answers:
        if answer.upVotes.filter(id=request.user.id):
            UpVotedAnswerIds.append(answer.ansID)
        images = AnswerImages.objects.filter(answer=answer).all()
        for image in images:
            answerImages.append(image)
    detail = 1
    context = {
        'post':post,
        'notification_count':notification_count,
        'images':images,
        'answerImages':answerImages,
        'saved_post_ids':saved_post_ids,
        'answers':answers,
        'UpVotedAnswerIds':UpVotedAnswerIds,
        'inDetailView':detail
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

# def AnswerView(request):
#     if request.method == "POST":
#         answer=request.POST.get('answer')
#         user=request.user
#         postSno =request.POST.get('postSno')
#         post= Post.objects.get(id=postSno)
#         answer=Answer(answer= answer, user=user, post=post)
#         answer.save()
#         return redirect(f"/{post.id}")        
        
def addAnswerNew_view(request):
    if request.method == "POST":
        post_id = request.POST.get('post_id')
        body = request.POST.get('answer')  
        post = Post.objects.get(id=post_id)
        answer,created = Answer.objects.get_or_create(post=post,user=request.user,body=body)
        answer.save()
        OutImages = []
        for file in request.FILES:
            image = request.FILES.get(file)
            i, created = AnswerImages.objects.get_or_create(answer=answer,image=image)
            i.save()

        Images = AnswerImages.objects.filter(answer=answer)
        for image in Images:
            OutImages.append(str(image.image))
            
        response = {
            'author':request.user.username,
            'body':body,
            'time':answer.time,
            'profile_pic':answer.user.profile.profile_pic.url,
            'images':OutImages
        }

        return JsonResponse(response)
        

def deleteAnswer_view(request):
    if request.method == 'POST':
        answerId = request.POST.get('button')
        answer = Answer.objects.get(ansID=answerId)
        post = answer.post
        answer.delete()
        return redirect('post_detail',post.id)

def post_upVote_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        answerId = data['answerId']
        answer =get_object_or_404( Answer,ansID = answerId)
        UpVoted = False
        if answer.upVotes.filter(id = request.user.id ).exists():
            answer.upVotes.remove(request.user)
            UpVoted = False
        else:
            answer.upVotes.add(request.user)
            UpVoted = True

        response = {
            'upVoteCount' : answer.get_total_upVotes(),
            'upVoted':UpVoted
        }

        return JsonResponse(response)


# def CommentView(request):
#     if request.method == "POST":
#         comment=request.POST.get('comment')
#         user=request.user
#         CmtSno =request.POST.get('CmtSno')
#         answer= Answer.objects.get(ansId=CmtSno)
#         comment=Comment(comment= comment, user=user, answer=answer)
#         comment.save()
        
#     return redirect(f"/{post.slug}")        


# def get_post_view(request):
#     if request.method == 'GET':
#         posts = Post.objects.all().order_by('-posted_on')
#         p = Paginator(posts,2)
#         page = request.GET.get('page')
#         try:
#             posts = p.page(page)
#         except PageNotAnInteger:
#             posts = p.page(1)
#         except EmptyPage:
#             posts = p.page(p.num_pages)

#         posts = serializers.serialize('json',posts)
#         response = {
#             'posts':posts
#         }
#         return JsonResponse(response)
