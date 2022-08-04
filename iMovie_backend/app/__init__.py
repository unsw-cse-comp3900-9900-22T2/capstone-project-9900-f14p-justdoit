from . import login, index, models, email
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources=r'/*', supports_credentials=True)

app.config.from_pyfile('../config.py')

models.init_db(app)

index.init_route(app)

login.init_route(app)

email.init_app(app)
