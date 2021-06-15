from django.contrib import admin
from .models import Tag,Post,Like,PostImages
# Register your models here.
admin.site.register(Tag)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(PostImages)



