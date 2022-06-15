# capstone-project-9900-f14p-justdoit
##Backend setting
### creat a database named iMovie
```shell
mysql -u root -p
create database imovie
```
### create tables
```shell
flask db migrate
flask db upgrade
```

### run this project
```shell
pip install -r requirement.txt

python3 app.py runserver
```

### files' introduction 
app:  main file, write function code

models.py: database tables create

config.py:  config




###if you want to change tables in database
```shell
flask db update
```
