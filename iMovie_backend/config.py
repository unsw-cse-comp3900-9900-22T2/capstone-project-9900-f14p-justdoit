SECRET_KEY = "123456"
DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'root'
PASSWORD = 'qwer1234'
HOST = '127.0.0.1'
PORT = '3306'
DATABASE = 'imovie'
#email
MAIL_SERVER= 'smtp.qq.com'
MAIL_PORT = 465
MAIL_USERNAME= '1191367164@qq.com'
MAIL_PASSWORD = 'dzhkerjqqedkjbcf'          #授权码， 授权码开启smtp服务后给的
MAIL_USE_TLS = False
MAIL_USE_SSL = True

SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=UTF8MB4'.format(
    DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
)
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = True


