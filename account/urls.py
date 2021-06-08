from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.register_view,name='register'),
    path('login/',views.login_view,name='login'),
    path('logout/',views.logout_view,name='logout'),
    path('profile/<int:id>/',views.profile_view,name='profile'),
    path('follow/',views.follow_view,name='follow'),
    path('validateUsername/',views.validateUsername_view,name='validateUsername'),
    path('validateEmail/',views.validateEmail_view,name='validateEmail'),


]