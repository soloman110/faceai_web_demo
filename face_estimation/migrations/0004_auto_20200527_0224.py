# Generated by Django 3.0.3 on 2020-05-27 02:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('face_estimation', '0003_auto_20200520_0908'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='member',
            options={'ordering': ['-created']},
        ),
    ]
