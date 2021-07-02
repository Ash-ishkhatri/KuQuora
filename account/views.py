from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth import get_user_model,login,logout,authenticate
from .models import Follow,Profile
from ku_quora.models import Post,PostImages
from saved.models import SavedPosts
from django.http import JsonResponse
import json
from notification.models import Notification
from core.settings import BASE_DIR
import os

# from django.contrib.auth.model import User

User = get_user_model()
# Create your views here.



def register_view(request):
    if request.user.is_authenticated:
        return redirect('index')
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        user = User.objects.filter(username=username).exists()
        
        if user:
            messages.error(request,'Error------    :( username already exists')
            return redirect('register')
        
        user = User.objects.filter(email = email).exists()
        if user:
            messages.error(request,'Error------    :( Email already in use')
            return redirect('register')
        
        if password1 != password2:
            messages.error(request,"Error------    :( Password don't match'")
            return redirect('register')
        
        user = User.objects.create_user(username=username,email=email,
                password = password1,first_name=first_name,last_name=last_name)
        # messages.success(request,"Success - ----  : ) Signed Up successfully")
        login(request,user)
        return redirect('index')
        
    return render(request,'account/register.html',{})


def login_view(request):

    if request.user.is_authenticated:
        return redirect('index')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username,password=password)
        if user != None:
            login(request,user)
            print('logged in')
            return redirect('index')
        else:
            messages.error(request,f"user credentials didn't match")
            return redirect('login')
    
    return render(request,'account/login.html',{})



def logout_view(request):
    logout(request)
    return redirect('login')


def profile_view(request,id):
    
    followers = 0
    followings = 0
    selfProfile = 1
    already_following = 1
    
    if id == request.user.id:
        selfProfile = 1
        user = request.user
        posts = Post.objects.filter(user=request.user).all().order_by('-posted_on')
        followers = Follow.objects.filter(following = user).count()
        followings = Follow.objects.filter(follower = user).count()
    else:
        selfProfile=0
        user = User.objects.get(id = id)
        posts = Post.objects.filter(user=user).all().order_by('-posted_on')
        followers = Follow.objects.filter(following = user).count()
        followings = Follow.objects.filter(follower = user).count()
        already_following = Follow.objects.filter(follower=request.user,following=user).exists()

    saved_post_ids = []
    saved_objs = SavedPosts.objects.filter(user = request.user).all()
    for obj in saved_objs:
        saved_post_ids.append(obj.post.id)
    
    notification_count = Notification.objects.filter(user=request.user,is_seen=False).count()
    images = PostImages.objects.all()
    context = {
        'selfProfile' : selfProfile,
        'User':user,
        'posts':posts,
        'followers':followers,
        'followings':followings,
        'already_following':already_following,
        'notification_count':notification_count,
        'images':images,
        'saved_post_ids':saved_post_ids
    }
    
    return render(request,'account/profile.html',context)

def profileEdit_view(request,id):
    if request.method == 'POST':
        designation = request.POST.get('designation')
        fb_link = request.POST.get('fb_link')
        profile_pic = request.FILES.get('profile_pic')
        twitter_link = request.POST.get('twitter_link')
        linkedin_link = request.POST.get('linkedin_link')
        u = User.objects.get(id=id)
        Profile.objects.filter(user=u).update(designation=designation,fb_link=fb_link,twitter_link=twitter_link,linkedin_link=linkedin_link)
        updatedProfile = Profile.objects.get(user=u)
        updatedProfile.profile_pic = profile_pic
        updatedProfile.save()
        messages.success(request,'Successfully updated profile')
        return redirect('index')
    notification_count = Notification.objects.filter(user=request.user).count()

    context = {
        'notification_count':notification_count
    }
    return render(request,'account/editProfile.html',context)

def follow_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        following_id = data['followingId']
        following = User.objects.get(id=following_id)

        already_followed = Follow.objects.filter(following=following,follower=request.user)
        
        followers = Follow.objects.filter(following=following).count()
        followings = Follow.objects.filter(follower=following).count()
        
        if already_followed:
            Follow.objects.filter(following=following,follower=request.user).delete()
            print('unfollowed')
        else:
            Follow.objects.create(following=following,follower=request.user)
            print('followed')
        
        followers = Follow.objects.filter(following=following).count()
        followings = Follow.objects.filter(follower=following).count()
        response = {
            'followings':followings,
            'followers':followers
        }
        return JsonResponse(response)

def validateUsername_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['username']
        
        taken = User.objects.filter(username=username).exists()

        if taken:
            response = {
                'taken':True
            }
        else:
            response = {
                'taken':False
            }

        return JsonResponse(response)


def validateEmail_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data['email']
        
        taken = User.objects.filter(email=email).exists()

        if taken:
            response = {
                'taken':True
            }
        else:
            response = {
                'taken':False
            }

        return JsonResponse(response)

def followings_view(request):

    return render(request,'account/followings.html',{})