from django.contrib import admin
from .models import Tag,Post,PostImages
from django.contrib.sessions.models import Session
# Register your models here.
admin.site.register(Tag)
admin.site.register(Post)
admin.site.register(PostImages)
admin.site.register(Session)


