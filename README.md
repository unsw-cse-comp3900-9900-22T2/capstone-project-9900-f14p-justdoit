# capstone-project-9900-f14p-justdoit
## Environment prepare
Mac / windows 10 / lubuntu 20.4.1
## version
### Mysql 
Mysql version is 8.0.19 or 8.0.23\
mysql user is "root"\
mysql password is "1234"\
Mysql download link: https://dev.mysql.com/downloads/
### Python3
Python3 version is 3.8 or 3.9
### nodejs
node version is 16.16.0\
node download link: https://nodejs.org/en/download/
### npm
npm version is 8.11.0

## Backend setting
### creat a database named imovie
```shell
mysql -u root -p
```
enter the password is "1234"\
in the mysql enter:
```shell
create database imovie;
```

###  Under folder /iMovie_backend run
```shell
flask db migrate
flask db upgrade
```

### install packages
```shell
pip3 install -r requirement.txt
```
### insert data 
```shell
python3 insert_movies.py
```
### run server
```shell
python3 app.py runserver
```


## Frontend setting
1. check install: node v16.16.0
```bash
node -v
```
2. install package.json
```bash
npm install
```
3 run the development server:
```bash
npm run dev
```

## Enter link 
You can enter link: http://localhost:8080/movie/home 


in Google or Firefox browsers

## Cloud mysql database
we use aliyuncs' Cloud database, you can connect our Cloud mysql to view our project's data.\
Some cloud mysql database's details are:

HOST = 'rm-bp16q3qua05mfx407lo.mysql.rds.aliyuncs.com'\
USERNAME = 'root'\
PASSWORD = '1234@qwer!'\
PORT = '3306'\
DATABASE = 'imovie'
