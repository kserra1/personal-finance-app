import pymongo 

url = 'mongodb+srv://nanananakas:SEY7qW8WxIgZaOot@financecluster.j6oxm8k.mongodb.net/'

client = pymongo.MongoClient(url)

db = client['test_mongo']