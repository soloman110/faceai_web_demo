from django.contrib.auth.models import User, Group
from rest_framework import serializers

from face_estimation.models import Department, Member

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ('id', 'name')


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('id', 'name', 'email', 'department', 'created')

    def to_representation(self, instance):
        self.fields['department'] = DepartmentSerializer(read_only=True)
        return super(MemberSerializer, self).to_representation(instance)
