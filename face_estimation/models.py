from django.db import models

# Create your models here.

# models.py
from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=50)
    def as_json(self):
        return dict(id=self.id, name=self.name)


class Member(models.Model):
    name = models.CharField(max_length=50)
    email = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']