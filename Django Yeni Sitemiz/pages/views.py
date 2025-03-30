from django.shortcuts import render, get_object_or_404
from .models import (
    DiscordSection, Feature, AboutSection, FAQ, Course,
    BlogPost, BlogCategory
)

def home(request):
    discord_section = DiscordSection.objects.first()
    features = Feature.objects.all()
    about_section = AboutSection.objects.first()
    faqs = FAQ.objects.filter(is_active=True)
    latest_courses = Course.objects.filter(is_active=True)[:3]
    return render(request, 'pages/index.html', {
        'discord_section': discord_section,
        'features': features,
        'about_section': about_section,
        'faqs': faqs,
        'latest_courses': latest_courses,
    })

def egitimler(request):
    return render(request, 'education/egitimler.html')

def blog(request):
    featured_post = BlogPost.objects.filter(is_featured=True).first()
    posts = BlogPost.objects.all()
    categories = BlogCategory.objects.all()
    
    return render(request, 'blog/blog.html', {
        'featured_post': featured_post,
        'posts': posts,
        'categories': categories,
    })

def blog_post(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    related_posts = BlogPost.objects.filter(
        category=post.category
    ).exclude(id=post.id).order_by('-created_at')[:2]
    
    documents = post.documents.all()
    links = post.links.all()
    
    return render(request, 'blog/blog-post.html', {
        'post': post,
        'related_posts': related_posts,
        'documents': documents,
        'links': links,
    })

def handler404(request, exception):
    return render(request, 'pages/404.html', status=404)