from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('solve/', TemplateView.as_view(template_name='crossword.html')),
]
