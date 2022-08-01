from . import login, index, models, email
from flask import Flask, request
from flask_cors import CORS
# 创建flask app
app = Flask(__name__)
CORS(app, resources=r'/*', supports_credentials=True)
# 从py文件中加载flask配置
app.config.from_pyfile('../config.py')
# 注册数据库连接
models.init_db(app)
# 注册首页路由，也就是Hello Word的路由
index.init_route(app)
# 注册登陆的路由
login.init_route(app)
# email的路由
email.init_app(app)