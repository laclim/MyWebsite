from django.conf.urls import url,include


urlpatterns = [
      url(r'^$',views.home, name='home'),
      url(r'^login/(w*)',views.login, name='login'),
      
]
