import os
import json

from flask import Flask
from dotenv import load_dotenv

from mongo import AtlasClient
from flask_cors import CORS


load_dotenv()
app = Flask(__name__)

db_uri = os.getenv('MONGO_DB_URI')
db = AtlasClient(db_uri,'LC')
collections = db.get_collectoin('company_wise')

CORS(app)


@app.route('/company_list',methods=['GET'])
def index():
    companies = collections.distinct('Company')
    return companies

@app.route('/company/<string:company_name>',methods=['GET'])
def company_questions(company_name):

    questions = collections.aggregate([
        {
            '$search': {
                'index': 'default',
                'text': {
                    'query': company_name,
                    'path': 'Company'
                }
            }
        }
    ])

    q = json.dumps(questions.to_list(),default=str)

    return q

if __name__ == '__main__':
    app.run()