# SECRET_KEY = "123456"
# DIALECT = 'mysql'
# DRIVER = 'pymysql'
# USERNAME = 'root'
# PASSWORD = 'qwer1234'
# HOST = '127.0.0.1'
# PORT = '3306'
# DATABASE = 'imovie'
# 
# SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=UTF8MB4'.format(
#     DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
# )
# SQLALCHEMY_COMMIT_ON_TEARDOWN = True
# SQLALCHEMY_TRACK_MODIFICATIONS = True



##################################################################

from urllib.parse import quote_plus as urlquote




SECRET_KEY = "123456789"
DIALECT = 'mysql'
DRIVER = 'pymysql'
USERNAME = 'root'
PASSWORD = '1234@qwer!'
HOST = 'rm-bp16q3qua05mfx407lo.mysql.rds.aliyuncs.com'
PORT = '3306'
DATABASE = 'imovie'

# SQLALCHEMY_DATABASE_URI = '{}+{}://{}:{}@{}:{}/{}?charset=UTF8MB4'.format(
#     DIALECT, DRIVER, USERNAME, PASSWORD, HOST, PORT, DATABASE
# )

SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{USERNAME}:{urlquote(PASSWORD)}@{HOST}:{PORT}/{DATABASE}?charset=UTF8MB4'
SQLALCHEMY_COMMIT_ON_TEARDOWN = True
SQLALCHEMY_TRACK_MODIFICATIONS = True
