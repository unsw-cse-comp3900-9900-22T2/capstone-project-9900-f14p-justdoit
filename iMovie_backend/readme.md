### creat a database named iMovie
```shell
mysql -u root -p
create database imovie
```
### install package
```shell
pip3 install -r requirement.txt
```

### create tables
```shell
flask db migrate
flask db upgrade
```

### run this project
```shell
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

### insert movie data
```shell
python3 insert_movies.py
``` 
