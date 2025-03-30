from django.contrib import admin
from .models import DiscordSection, DiscordFeature, Feature, AboutSection, AboutDetail, FAQ, Course, BlogCategory, BlogPost, BlogDocument, BlogLink

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'is_active', 'order')
    list_editable = ('is_active', 'order')
    search_fields = ('title', 'description')
    list_filter = ('is_active', 'created_at')
    date_hierarchy = 'created_at'

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('question', 'answer')
    list_filter = ('is_active',)

class AboutDetailInline(admin.TabularInline):
    model = AboutDetail
    extra = 1

@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    inlines = [AboutDetailInline]

class DiscordFeatureInline(admin.TabularInline):
    model = DiscordFeature
    extra = 1
    verbose_name = "Discord Özelliği"
    verbose_name_plural = "Discord Özellikleri"

@admin.register(DiscordSection)
class DiscordSectionAdmin(admin.ModelAdmin):
    search_fields = ('title', 'description')
    inlines = [DiscordFeatureInline]

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order')
    search_fields = ('title',)
    ordering = ['order']


class BlogDocumentInline(admin.TabularInline):
    model = BlogDocument
    extra = 1

class BlogLinkInline(admin.TabularInline):
    model = BlogLink
    extra = 1
    
@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at', 'is_featured', 'read_time')
    list_filter = ('category', 'is_featured', 'created_at')
    search_fields = ('title', 'content', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [BlogDocumentInline, BlogLinkInline]
    date_hierarchy = 'created_at'

