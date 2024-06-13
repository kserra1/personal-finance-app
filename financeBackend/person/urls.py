from django.urls import path 

from . import views 

urlpatterns = [
    path('', views.index),
    path('add/', views.add_person),
    path('get/', views.get_all_person),
    path('api/auth/login/', views.login, name='login'),
    path('api/auth/signup/', views.signup, name='signup'),
    path('api/auth/user/', views.get_username, name='get_username'),
    path('api/auth/addaccount/', views.add_account, name='add_account'),
    path('api/auth/getaccount/<str:username>/', views.get_account, name='get_account'),
    path('api/auth/removeaccount/', views.remove_account, name='remove_account'),
    path('api/auth/deposit/', views.deposit, name='deposit'),
    path('api/auth/withdraw/', views.withdraw, name='withdraw'),
    path('api/auth/transfer/', views.transfer, name='transfer'), 
    path('api/auth/get_transactions/<str:username>/', views.get_transactions, name='get_transactions'),

]