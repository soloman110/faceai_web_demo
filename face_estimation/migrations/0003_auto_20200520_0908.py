# Generated by Django 3.0.3 on 2020-05-20 09:08

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('face_estimation', '0002_member'),
    ]

    operations = [
        migrations.AddField(
            model_name='member',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='member',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
