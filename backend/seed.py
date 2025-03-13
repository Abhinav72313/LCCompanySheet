import csv
import os
from dotenv import load_dotenv

from backend.mongo import AtlasClient

load_dotenv()  # take environment variables from .env.

mongodb_uri = os.getenv('MONGO_DB_URI')

try:
    db = AtlasClient(mongodb_uri,'LC')
except Exception as e:
    print(e)
    exit(0)

client = db.get_collectoin('company_wise')

questoins = []

for dirpath,dirname,filenames in os.walk('../leetcode-company-wise-problems/'):

    if dirpath.startswith('./leetcode-company-wise-problems/.git') or dirpath.startswith('./.idea') or dirpath == './leetcode-company-wise-problems/':
        continue

    with open(os.path.join(dirpath,'5. All.csv')) as f:
        reader = csv.reader(f)
        for row in reader:

            if row[2] == 'Frequency':
                continue

            if len(row) == 6:
                d = {
                    "Company":os.path.basename(dirpath).capitalize(),
                    "Difficulty": row[0].upper(),
                    "Title": row[1].capitalize(),
                    "Frequency": row[2],
                    "Acceptance Rate": row[3],
                    "Link": row[4],
                    "Topics":[x.replace('(Priority Queue)','').strip().capitalize() for x in row[5].split(',')]
                }
                questoins.append(d)


client.insert_many(questoins)
print('Added to DB')