from .models import person_collection

from django.http import JsonResponse, HttpResponse

from django.contrib.auth import authenticate 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404
from django.utils import timezone 


def index(request):
    return JsonResponse({'message': 'Hello, world!'})

def add_person(request):
    records = {
        "first_name": "John",
        "last_name": "Doe",
    }
    person_collection.insert_one(records)
    return JsonResponse({'message': 'Person added successfully!'})

def get_all_person(request):
    persons = person_collection.find()
    response = []
    for person in persons:
        person['_id'] = str(person['_id'])
        response.append(person)
    return JsonResponse(response, safe=False)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data.get('username'))
    if not user.check_password(request.data.get('password')):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})
 
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        username = request.data.get('username')
        password = request.data.get('password')
        # Check if the user already exists
        if not User.objects.filter(username=username).exists():
            # If the user doesn't exist, create a new one
            user = User.objects.create_user(username=username, password=password)
            user_data ={
                "username": username,
                "email": request.data.get('email'),
            }
            person_collection.insert_one(user_data)
            token = Token.objects.create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'User with this username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_username(request):
    print('jadfjadf')
    try:
        # Extract the token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return Response({'error': 'Authorization header missing'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract the token part (excluding 'Token ')
        token = auth_header.split(' ')[1]
        print(token)
        
        # Retrieve the user associated with the token
        token_obj = Token.objects.get(key=token)
        user = token_obj.user
        
        return Response({'username': user.username}, status=status.HTTP_200_OK)
    
    except Token.DoesNotExist:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    except IndexError:
        return Response({'error': 'Token missing or invalid'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_account(request):
    username = request.data.get('username')  
    user = person_collection.find_one({'username': username})
    if user:
        if 'accounts' not in user:
            user['accounts'] = []
        user['accounts'].append({
            'account_name': request.data.get('account_name'),
            'balance': request.data.get('balance')
        })
        person_collection.update_one({'username': username}, {'$set': {'accounts': user['accounts']}})
        return JsonResponse({'message': 'Account added successfully!'}, status=status.HTTP_201_CREATED)
    else:
        return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_account(request, username):
    user = person_collection.find_one({'username': username})
    if user:
        if 'accounts' in user:
            print(user['accounts'])
            return JsonResponse(user['accounts'], safe=False)
        else:
            return JsonResponse({'message': 'User has no accounts yet.'}, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def remove_account(request):
    username = request.data.get('username')
    account_name = request.data.get('account_name')
    user = person_collection.find_one({'username': username})
    if user:
        if 'accounts' in user:
            accounts = user['accounts']
            print(accounts)
            removed = False
            for account in accounts:
                if account['account_name'] == account_name:
                    accounts.remove(account)
                    removed = True
                    break
            if removed:
                person_collection.update_one({'username': username}, {'$set': {'accounts': accounts}})
                return JsonResponse({'message': f'Account "{account_name}" removed successfully!'}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': f'Account "{account_name}" not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return JsonResponse({'error': 'User has no accounts yet.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def deposit(request):
    username = request.data.get('username')
    account_name = request.data.get('account_name')
    amount = request.data.get('amount')
    message = request.data.get('message')
    reason = request.data.get('reason')
    
    user = person_collection.find_one({'username': username})
    if user:
        accounts = user.get('accounts', [])
        for account in accounts:
            if account['account_name'] == account_name:
                if 'transactions' not in account:
                    account['transactions'] = []
                account['balance'] += float(amount)
                account['transactions'].append({
                    'amount': float(amount),
                    'type': 'deposit',
                    'message': message,
                    'timestamp': timezone.now().isoformat(),
                    'reason': reason
                })
                person_collection.update_one({'username': username}, {'$set': {'accounts': accounts}})
                return JsonResponse({'message': 'Deposit successful!', 'balance': account['balance']}, status=status.HTTP_200_OK)
        return JsonResponse({'error': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
def withdraw(request):
    username = request.data.get('username')
    account_name = request.data.get('account_name')
    amount = request.data.get('amount')
    message = request.data.get('message')
    reason = request.data.get('reason')
    user = person_collection.find_one({'username': username})
    if user:
        accounts = user.get('accounts', [])
        for account in accounts:
            if account['account_name'] == account_name:
                if account['balance'] >= float(amount):
                    if 'transactions' not in account:
                        account['transactions'] = []
                    account['balance'] -= float(amount)
                    account['transactions'].append({
                        'amount': float(amount),
                        'type': 'withdrawal',
                        'message': message,
                        'timestamp': timezone.now().isoformat(),
                        'reason': reason
                    })
                    person_collection.update_one({'username': username}, {'$set': {'accounts': accounts}})
                    return JsonResponse({'message': 'Withdrawal successful!', 'balance': account['balance']}, status=status.HTTP_200_OK)
                else:
                    return JsonResponse({'error': 'Insufficient funds.'}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({'error': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['POST'])
def transfer(request):
    username = request.data.get('username')
    from_account_name = request.data.get('from_account')
    to_account_name = request.data.get('to_account')
    amount = request.data.get('amount')
    message = request.data.get('message')
    reason = request.data.get('reason')
    
    user = person_collection.find_one({'username': username})
    if user:
        accounts = user.get('accounts', [])
        from_account = None
        to_account = None
        print(from_account_name)
        print(to_account_name)

        for account in accounts:
            if account['account_name'] == from_account_name:
                from_account = account
            if account['account_name'] == to_account_name:
                to_account = account

        if from_account and to_account:
            if from_account['balance'] >= float(amount):
                if 'transactions' not in from_account:
                    from_account['transactions'] = []
                if 'transactions' not in to_account:
                    to_account['transactions'] = []
                from_account['balance'] -= float(amount)
                to_account['balance'] += float(amount)
                timestamp = timezone.now().isoformat()
                from_account['transactions'].append({
                    'amount': float(amount),
                    'type': 'transfer',
                    'message': message,
                    'timestamp': timestamp,
                    'to_account': to_account_name
                })
                to_account['transactions'].append({
                    'amount': float(amount),
                    'type': 'transfer',
                    'message': message,
                    'timestamp': timestamp,
                    'to_account': from_account_name,
                    'reason': reason
                })
                person_collection.update_one({'username': username}, {'$set': {'accounts': accounts}})
                return JsonResponse({'message': 'Transfer successful!'}, status=status.HTTP_200_OK)
            else:
                return JsonResponse({'error': 'Insufficient funds.'}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({'error': 'One or both accounts not found.'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_transactions(request, username):
    print(username)
    user = person_collection.find_one({'username': username})
    if user:
        all_transactions = []
        accounts = user.get('accounts', [])
        for account in accounts:
            transactions = account.get('transactions', [])
            all_transactions.extend(transactions)
        
        all_transactions.sort(key=lambda x: x['timestamp'], reverse=True)

        return JsonResponse(all_transactions, safe=False, status=status.HTTP_200_OK)
    else:
        return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
