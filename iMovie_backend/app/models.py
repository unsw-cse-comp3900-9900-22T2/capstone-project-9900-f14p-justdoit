from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

#test
db = SQLAlchemy()
migrate = Migrate()


def init_db(app):
    db.init_app(app)
    migrate.init_app(app, db)
    return db

# users
class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(256), unique=True, nullable=False)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    email = db.Column(db.String(256), unique=True, nullable=False)
    role = db.Column(db.Integer, nullable=False, default=0)   # 0:user,  1:admin
    verifycode = db.Column(db.Integer, nullable=True)  # change password send verifycode to email
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    description = db.Column(db.TEXT)  # user description in user profile
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

# movies
class MoviesModel(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    mid = db.Column(db.String(256), unique=True, nullable=False)
    moviename = db.Column(db.String(256), unique=True, nullable=False)
    coverimage = db.Column(db.String(256), unique=True, nullable=True)
    description = db.Column(db.TEXT, nullable=False)
    genre = db.Column(db.String(120), nullable=True)  # genre     # action,crime,crime,crime
    cast = db.Column(db.String(256), nullable=True)
    crew = db.Column(db.String(256), nullable=True)  # dict
    director = db.Column(db.String(256), nullable=True)  # dict
    country = db.Column(db.String(120), nullable=True)  # dict
    language = db.Column(db.String(120), nullable=True)  # dict
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    avg_rate = db.Column(db.FLOAT, nullable=True)
    release_date = db.Column(db.DateTime)  # release_date
    Off_data = db.Column(db.DateTime)  # Off_data
    # duration = db.Column(db.Integer)
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class GenreModel(db.Model):
    __tablename__ = 'genre'

    id = db.Column(db.Integer, primary_key=True)
    gid = db.Column(db.String(256), unique=True, nullable=False)
    genrename = db.Column(db.String(256), unique=True, nullable=False)
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class movieReviewModel(db.Model):
    __tablename__ = 'moviereview'

    id = db.Column(db.Integer, primary_key=True)
    mrid = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid
    mid = db.Column(db.String(256), nullable=False)  # movies.mid
    review = db.Column(db.TEXT)
    rate = db.Column(db.FLOAT)
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class userReviewModel(db.Model):
    __tablename__ = 'userreview'

    id = db.Column(db.Integer, primary_key=True)
    urid = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid
    mrid = db.Column(db.String(256), nullable=False)  # moviereview.uid
    review = db.Column(db.TEXT)
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class movielikeModel(db.Model):
    __tablename__ = 'movielike'

    id = db.Column(db.Integer, primary_key=True)
    mlid = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid
    mid = db.Column(db.String(256), nullable=False)  # movies.uid
    type = db.Column(db.Integer, nullable=False, default=0)  # 0:like,  1:dislike
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class reviewlikeModel(db.Model):
    __tablename__ = 'reviewlike'

    id = db.Column(db.Integer, primary_key=True)
    rlid = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid
    urid = db.Column(db.String(256), nullable=False)  # userreview.uid
    # type = db.Column(db.Integer, nullable=False, default=0)  # 0:like,  1:dislike
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class wishWatchModel(db.Model):
    __tablename__ = 'wishWatch'

    id = db.Column(db.Integer, primary_key=True)
    wid = db.Column(db.String(256), unique=True, nullable=False)
    type = db.Column(db.Integer, nullable=False, default=0)  # 0:wish, 1: watched
    uid = db.Column(db.String(256), nullable=False)  # users.uid
    mid = db.Column(db.String(256), nullable=False)  # movies.mid
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class movielistModel(db.Model):
    __tablename__ = 'movielist'

    id = db.Column(db.Integer, primary_key=True)
    molid  = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid
    mid = db.Column(db.String(256), nullable=False)  # movies.uid
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.TEXT)
    # public = db.Column(db.Integer, nullable=False, default=1) # 0:not public,  1: public
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class viewhistoryModel(db.Model):
    __tablename__ = 'viewHistory'

    id = db.Column(db.Integer, primary_key=True)
    vid = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid
    mid = db.Column(db.String(256), nullable=False)  # movies.uid
    frequency = db.Column(db.Integer, nullable=False, default=1)  # view frequency
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class blocklistModel(db.Model):
    __tablename__ = 'blockList'

    id = db.Column(db.Integer, primary_key=True)
    bid = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid (ban)
    buid = db.Column(db.String(256), nullable=False)  # users.uid (be banned)
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()



class followModel(db.Model):
    __tablename__ = 'follow'

    id = db.Column(db.Integer, primary_key=True)
    fid = db.Column(db.String(256), unique=True, nullable=False)
    uid = db.Column(db.String(256), nullable=False)  # users.uid (follow)
    fuid = db.Column(db.String(256), nullable=False)  # users.uid (be followed)
    active = db.Column(db.Integer, nullable=False, default=1)  # 0:delete,  1:not delete
    ctime = db.Column(db.DateTime, nullable=False)  # create time
    utime = db.Column(db.DateTime, nullable=False)  # update time

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()