# Generated by Django 5.1.4 on 2025-03-17 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0004_aboutsection_aboutdetail'),
    ]

    operations = [
        migrations.CreateModel(
            name='FAQ',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=255, verbose_name='Soru')),
                ('answer', models.TextField(verbose_name='Cevap')),
                ('order', models.PositiveIntegerField(verbose_name='Sıralama')),
                ('is_active', models.BooleanField(verbose_name='Aktif mi?')),
            ],
            options={
                'verbose_name': 'Sıkça Sorulan Soru',
                'verbose_name_plural': 'Sıkça Sorulan Sorular',
                'ordering': ['order'],
            },
        ),
    ]
