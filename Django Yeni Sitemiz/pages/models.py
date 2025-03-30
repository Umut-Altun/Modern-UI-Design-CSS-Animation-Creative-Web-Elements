from django.db import models
from django.utils.text import slugify
from ckeditor_uploader.fields import RichTextUploadingField


class DiscordSection(models.Model):
    title = models.CharField(max_length=200, verbose_name="Başlık")
    description = models.TextField(verbose_name="Açıklama")
    discord_link = models.URLField(verbose_name="Discord Davet Linki")
    community_image = models.ImageField(upload_to='discord/', verbose_name="Topluluk Görseli")

    class Meta:
        verbose_name = "Discord Bölümü"
        verbose_name_plural = "Discord Bölümü"

    def __str__(self) -> str:
        return str(self.title)

class DiscordFeature(models.Model):
    discord = models.ForeignKey(DiscordSection, on_delete=models.CASCADE, related_name='features')
    icon = models.CharField(max_length=50, verbose_name="İkon")
    text = models.CharField(max_length=50, verbose_name="Özellik")
    
    class Meta:
        verbose_name = "Discord Özelliği"
        verbose_name_plural = "Discord Özellikleri"

    def __str__(self) -> str:
        return str(self.text)

class Feature(models.Model):
    icon = models.CharField(max_length=50, verbose_name="İkon", help_text="Örn: fas fa-rocket")
    title = models.CharField(max_length=100, verbose_name="Başlık")
    order = models.PositiveIntegerField( verbose_name="Sıralama")

    class Meta:
        verbose_name = "Özellik"
        verbose_name_plural = "Özellikler"
        ordering = ['order']

    def __str__(self) -> str:
        return str(self.title)

class AboutSection(models.Model):
    profile_image = models.ImageField(upload_to='about/', verbose_name="Profil Fotoğrafı")
    experience_years = models.CharField(max_length=10, verbose_name="Deneyim Yılı", help_text="Örn: 3+")
    title = models.CharField(max_length=200, verbose_name="Başlık", default="Ben Kimim?")
    description = models.TextField(verbose_name="Ana Açıklama")

    class Meta:
        verbose_name = "Hakkımda Bölümü"
        verbose_name_plural = "Hakkımda Bölümü"

    def __str__(self) -> str:
        return "Hakkımda Bölümü"

class AboutDetail(models.Model):
    about = models.ForeignKey(AboutSection, on_delete=models.CASCADE, related_name='details')
    icon = models.CharField(max_length=50, verbose_name="İkon", help_text="Örn: fas fa-briefcase")
    description = models.TextField(verbose_name="Detay Açıklaması")
    order = models.PositiveIntegerField(verbose_name="Sıralama")

    class Meta:
        verbose_name = "Hakkımda Detay"
        verbose_name_plural = "Hakkımda Detayları"
        ordering = ['order']

    def __str__(self) -> str:
        return f"Detay {self.order}"

class FAQ(models.Model):
    question = models.CharField(max_length=255, verbose_name="Soru")
    answer = models.TextField(verbose_name="Cevap")
    order = models.PositiveIntegerField(verbose_name="Sıralama")
    is_active = models.BooleanField(verbose_name="Aktif mi?")

    class Meta:
        verbose_name = "Sıkça Sorulan Soru"
        verbose_name_plural = "Sıkça Sorulan Sorular"
        ordering = ['order']

    def __str__(self) -> str:
        return str(self.question)

class Course(models.Model):
    title = models.CharField(max_length=200, verbose_name="Eğitim Başlığı")
    description = models.TextField(verbose_name="Açıklama")
    thumbnail = models.ImageField(upload_to='courses/', verbose_name="Eğitim Görseli")
    url = models.URLField(verbose_name="Eğitim Linki")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Oluşturulma Tarihi")
    is_active = models.BooleanField(verbose_name="Aktif mi?")
    order = models.PositiveIntegerField(verbose_name="Sıralama")

    class Meta:
        verbose_name = "Eğitim"
        verbose_name_plural = "Eğitimler"
        ordering = ['-created_at']

    def __str__(self) -> str:
        return str(self.title)

class BlogCategory(models.Model):
    name = models.CharField(max_length=100, verbose_name="Kategori Adı")
    slug = models.SlugField(unique=True, blank=True)

    class Meta:
        verbose_name = "Blog Kategorisi"
        verbose_name_plural = "Blog Kategorileri"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.name)

class BlogPost(models.Model):
    title = models.CharField(max_length=200, verbose_name="Başlık")
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField(verbose_name="Özet", help_text="Kısa açıklama")
    content = RichTextUploadingField(verbose_name="İçerik")
    image = models.ImageField(upload_to='blog/', verbose_name="Kapak Görseli")
    category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, verbose_name="Kategori")
    read_time = models.PositiveIntegerField(verbose_name="Okuma Süresi (dk)")
    is_featured = models.BooleanField(verbose_name="Öne Çıkan")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Blog Yazısı"
        verbose_name_plural = "Blog Yazıları"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.title)

class BlogDocument(models.Model):
    post = models.ForeignKey('BlogPost', on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=200, verbose_name="Doküman Başlığı")
    file = models.FileField(upload_to='blog/documents/', verbose_name="Doküman")

    class Meta:
        verbose_name = "Blog Dokümanı"
        verbose_name_plural = "Blog Dokümanları"

    def __str__(self) -> str:
        return str(self.title)

class BlogLink(models.Model):
    post = models.ForeignKey('BlogPost', on_delete=models.CASCADE, related_name='links')
    title = models.CharField(max_length=200, verbose_name="Bağlantı Başlığı")
    url = models.URLField(verbose_name="Bağlantı URL")

    class Meta:
        verbose_name = "İlgili Bağlantı"
        verbose_name_plural = "İlgili Bağlantılar"

    def __str__(self) -> str:
        return str(self.title)