from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from face_estimation import views

from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from django.urls import path, include

from rest_framework.schemas import get_schema_view
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer

schema_view = get_schema_view(
    title='Example API',
    renderer_classes=[SwaggerUIRenderer]
)

router = DefaultRouter()
router.register(r'members', views.MemberViewSet)
router.register(r'department', views.DepartmentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls), #admin 페이지 지원
    path('restful/', include(router.urls)), #restful Api 등록

    #redirect 설정
    url(r'^$', RedirectView.as_view(url='/age_gender/')),
    url(r'^age_gender/$', views.age_gender),
    url(r'^emotion/$', views.emotion),
    url(r'^member_register/$', views.member_register),
    url(r'^video/$', views.video),

    url(r'^recognize_model_reload/$', views.recognize_model_reload),
    url(r'^recognize/$', views.recognize_img),
    url(r'^upload_ajax/$', views.upload_ajax),
    url(r'^emotion_handler/$', views.emotion_handler),
    url(r'^depcreate/$', views.depInfoCreate),
    url(r'^upload_multi_ajax/$', views.upload_multi_ajax),
    url(r'^test/$', views.test),
    url(r'^swagger/$', schema_view),
]
