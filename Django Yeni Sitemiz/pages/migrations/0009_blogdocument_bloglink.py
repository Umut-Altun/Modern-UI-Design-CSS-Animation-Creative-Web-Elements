# Generated by Django 5.1.4 on 2025-03-17 20:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0008_alter_blogpost_content'),
    ]

    operations = [
        migrations.CreateModel(
            name='BlogDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Doküman Başlığı')),
                ('file', models.FileField(upload_to='blog/documents/', verbose_name='Doküman')),
                ('file_size', models.CharField(max_length=20, verbose_name='Dosya Boyutu')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='pages.blogpost')),
            ],
            options={
                'verbose_name': 'Blog Dokümanı',
                'verbose_name_plural': 'Blog Dokümanları',
            },
        ),
        migrations.CreateModel(
            name='BlogLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Bağlantı Başlığı')),
                ('url', models.URLField(verbose_name='Bağlantı URL')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='links', to='pages.blogpost')),
            ],
            options={
                'verbose_name': 'İlgili Bağlantı',
                'verbose_name_plural': 'İlgili Bağlantılar',
            },
        ),
    ]
