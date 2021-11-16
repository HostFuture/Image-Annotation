from operator import le
from backend import db, app
from json import dumps


class User(db.Model):
  __tablename__ = "Users"
  id = db.Column(db.Integer, primary_key=True)
  first_name = db.Column(db.String(1000))
  last_name = db.Column(db.String(1000))
  email = db.Column(db.String(1000), unique=True, nullable=False)
  password = db.Column(db.Text, nullable=False)

  def __init__(self, email, fname, lname, password) -> None:
    self.email = email
    self.first_name = fname
    self.last_name = lname
    self.password = password

  def is_authenticated(self):
    return True

  def is_active(self):
    return True
  
  def is_anonymous(self):
    return False

  def get_id(self):
    return self.id
  
  def __repr__(self) -> str:
    return '<User %r>' % self.id



class Project(db.Model):
  __tablename__ = "Projects"
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("Users.id"), nullable=False)
  project_name = db.Column(db.String(1000), nullable=False)
  project_path = db.Column(db.String(1000), nullable=False)
  files = db.Column(db.Text)

  # Relationship Defination
  user = db.relationship('User', primaryjoin="User.id==Project.user_id")

  def __init__(self, user, project_name, project_path, files={}) -> None:
    self.user_id = user
    self.project_name = project_name
    self.project_path = project_path
    self.files = dumps(files)

  def __repr__(self) -> str:
    return '<Project %r>' % self.user_id


class ImageAnnotation(db.Model):
  __tablename__ = "ImageAnnotations"
  id = db.Column(db.Integer, primary_key=True)
  image_name = db.Column(db.String(1000), nullable=False)
  annotation = db.Column(db.Text)
  left = db.Column(db.Integer)
  top = db.Column(db.Integer)
  right = db.Column(db.Integer)
  bottom = db.Column(db.Integer)
  
  def __init__(self, image_name, annotation, left, top, right, bottom) -> None:
    self.image_name = image_name
    self.annotation = annotation
    self.left = left
    self.top = top
    self.right = right
    self.bottom = bottom

  def __repr__(self) -> str:
    return '<ImageAnnotation %r>' % self.id