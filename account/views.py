from django.shortcuts import render,redirect
from django.contrib import messages
from django.contrib.auth import get_user_model,login,logout,authenticate
from .models import Follow
from ku_quora.models import Post,Like,Dislike
from django.http import JsonResponse
import json


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
        messages.success(request,"Success - ----  : ) Signed Up successfully")
        return redirect('login')
        
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

    liked_post_ids = []
    liked_objs = Like.objects.filter(user=request.user).all()
    for liked_obj in liked_objs:
        liked_post_ids.append(liked_obj.post.id)
        print(liked_obj.post.id)
    disliked_post_ids = []
    disliked_objs = Dislike.objects.filter(user=request.user).all()
    for disliked_obj in disliked_objs:
        disliked_post_ids.append(disliked_obj.post.id)

    context = {
        'selfProfile' : selfProfile,
        'User':user,
        'posts':posts,
        'followers':followers,
        'followings':followings,
        'already_following':already_following,
        'liked_posts_ids':liked_post_ids,
        'disliked_posts_ids':disliked_post_ids
    }
    return render(request,'account/profile.html',context)

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