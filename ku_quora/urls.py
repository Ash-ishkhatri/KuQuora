from django.urls import path
from . import views

urlpatterns = [
    path('',views.index_view,name='index'),
    path('create_post/',views.create_post_view,name='create_post'),
    path('delete/',views.delete_post_view,name = 'delete_post'),
    path('post/<uuid:post_id>/',views.post_detail_view,name='post_detail'),
    path('tag/<slug:tag_slug>',views.tags_post_view,name='tags'),
    path('addAnswer/',views.addAnswerNew_view)
]