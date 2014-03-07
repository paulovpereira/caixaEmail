from django.conf.urls import patterns, url

from emails import views

urlpatterns = patterns('',
    url(r'^$', views.listar_todos, name='Listar todos'),
    url(r'^total/$', views.total, name='Total de emails')
)