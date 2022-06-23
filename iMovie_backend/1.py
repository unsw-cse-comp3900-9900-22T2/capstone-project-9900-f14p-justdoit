
import pymysql
import xlrd
import datetime
from openpyxl.reader.excel import load_workbook
from builtins import int

import random
import time
connection = pymysql.connect(host='localhost',user='root',passwd='qwer1234',db="imovie")


cursor = connection.cursor()

sql = 'select * from movies'
connection.ping(reconnect=True)  # reconnecting mysql
cursor.execute(sql)
connection.commit()
