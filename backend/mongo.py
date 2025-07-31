from pymongo import MongoClient
from pymongo.server_api import ServerApi

class AtlasClient:
    def __init__(self,uri,db_name):
        self.client = MongoClient(uri, server_api=ServerApi('1'))

        self.client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        self.db = self.client[db_name]

    def get_collection(self,collection):
        return self.db[collection]