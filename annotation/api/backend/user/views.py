from flask import Blueprint, request, jsonify, send_file
from flask.wrappers import Response
from backend import app, db
from backend.user.models import User, Project, ImageAnnotation
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from cryptocode import encrypt, decrypt
import uuid, os, json
from datetime import datetime


# Defining path for files
user_dir = 'D:/Downloads/Training/Smart Cow/annotation/src/user_data'
if not os.path.isdir(user_dir):
  os.makedirs(user_dir)

# Assigning paths to access the modules and functions
user = Blueprint('user', __name__)

# Defining Routes and Functions
@user.route('/user/register', methods=['POST'])
def userRegister():
  if request.method == 'POST':
    req = request.get_json(force=True)
    fname = req['first_name']
    lname = req['last_name']
    email = req['email']
    password = req['password']

    if fname == '' or lname == '' or email == '' or password == '':
      return jsonify({"msg": f"All the fields are mandatory for this request", "status": 406}), 406

    if User.query.filter_by(email=email).count() > 0:
      return jsonify({"msg": f"There is an user associated with email address { email }", "status": 409}), 409
    
    u = User(email, fname, lname, encrypt(password, app.config['PASSWORD_TOKEN']))
    db.session.add(u)
    db.session.commit()

    return jsonify({"msg": f"The account has been created for { email }", "status": 200}), 200
  return jsonify({"msg": f"Request Method not allowed!", "status": 405}), 405


@user.route('/user/login', methods=['POST'])
def userLogin():
  if request.method == 'POST':
    req = request.get_json(force=True)
    email = req['email']
    password = req['password']

    if email == '' or password == '':
      return jsonify({"msg": f"All the fields are mandatory for this request", "status": 406}), 406

    u = User.query.filter_by(email=email)
    if u.count() <= 0:
      return jsonify({"msg": f"There is no user associated with the email address { email }", "status": 404}), 404
    
    u = u.first()
    if password != decrypt(u.password, app.config['PASSWORD_TOKEN']):
      return jsonify({"msg": f"The email and password combination doesn't match", "status": 401}), 401
    
    atoken = create_access_token(identity=u.id)
    rtoken = create_refresh_token(identity=u.id)
    
    return jsonify({
      "msg": f"The user is successfully authenticated", 
      "token": {"accessToken": atoken, "refreshToken": rtoken}, 
      "status": 200
    }), 200

  return jsonify({"msg": f"Request Method not allowed!", "status": 405}), 405


@user.route('/user/forgot', methods=['POST'])
def forgotPassword():
  if request.method == 'POST':
    req = request.get_json(force=True)
    email = req['email']
    password = req['password']

    if email == '' or password == '':
      return jsonify({"msg": f"All the fields are mandatory for this request", "status": 406}), 406

    u = User.query.filter_by(email=email)
    if u.count() <= 0:
      return jsonify({"msg": f"There is no user associated with the email address { email }", "status": 404}), 404
    
    u = u.first()
    u.password = encrypt(password, app.config['PASSWORD_TOKEN'])
    db.session.commit()
    
    return jsonify({"msg": f"The account password has been updated successfully", "status": 200}), 200
  
  return jsonify({"msg": f"Request Method not allowed!", "status": 405}), 405


@user.route('/project/create/<project_name>', methods=['PUT'])
@jwt_required()
def createProject(project_name):
  if request.method == 'PUT':
    if project_name == '':
      return jsonify({"msg": f"All the fields are mandatory for this request", "status": 406}), 406

    current_user = get_jwt_identity()
    if Project.query.filter_by(user_id=current_user).count() > 0:
      return jsonify({"msg": f"You can't create more than one project", "status": 405}), 405
    
    # Creating the project directory
    user_path = str(uuid.uuid4())
    project_path = f"{ user_dir }/{ user_path }"
    os.makedirs(project_path)
    
    # Creating a record associated with the Project
    p = Project(current_user, project_name, user_path)
    db.session.add(p)
    db.session.commit()
    
    return jsonify({"msg": f"The requested Project is created", "status": 200}), 200
  return jsonify({"msg": f"Request Method not allowed!", "status": 405}), 405
  

@user.route('/user/me', methods=['GET'])
@jwt_required()
def userDetails():
  current_user = get_jwt_identity()
  u = User.query.get(current_user)
  p = Project.query.filter_by(user_id=current_user)

  return jsonify({
    "msg": "User details found successfully",
    "user": f'{u.first_name} {u.last_name}',
    "project": p.count(),
    "project_name": None if p.count() <= 0 else p.first().project_name,
    "project_files": 0 if p.count() <= 0 else len(json.loads(p.first().files)),
    "project_dir": None if p.count() <= 0 else p.first().project_path,
    "file_names": None if p.count() <= 0 else json.loads(p.first().files),
    "status": 200
  }), 200


@user.route('/project/upload', methods=['POST'])
@jwt_required()
def uploadData():
  if request.method == 'POST':
    current_user = get_jwt_identity()
    p = Project.query.filter_by(user_id=current_user)
    
    if p.count() <= 0:
      return jsonify({"msg": f"There is no project available under the user", "status": 404}), 404

    files = request.files.getlist('files[]')
    p = p.first()

    if len(files) <= 0:
      return jsonify({"msg": f"Please select atleast one file before processing", "status": 406}), 406
    
    if len(files) > 10 - len(json.loads(p.files)):
      return jsonify({"msg": f"You have reached the maximum threshold of files to be uploaded", "status": 405}), 405

    project_path = f"{ user_dir }/{ p.project_path }"
    file_details = json.loads(p.files)
    file_index = len(file_details)

    for file in files:
      file_name = f'{int(datetime.now().timestamp())}_{file.filename}'
      file.save(os.path.join(project_path, file_name))
      file_details[file_index] = file_name
      file_index += 1
    
    p.files = json.dumps(file_details)
    db.session.commit()

    return jsonify({"msg": f"{len(files)} files are uploaded to the project directory. Total file count { file_index }", "status": 200}), 200
  return jsonify({"msg": f"Request Method not allowed!", "status": 405}), 405


@user.route('/project/image/update', methods=['POST'])
@jwt_required()
def annotationImageUpdate():
  if request.method == 'POST':
    req = request.get_json(force=True)
    anno = json.loads(req['annotation_data'])

    if len(anno) <= 0 or req['image_name'] == '':
      return jsonify({"msg": f"All the fields are mandatory for this request", "status": 406}), 406
    
    for a in anno:
      ia_query = ImageAnnotation.query.filter_by(
        image_name=req['image_name'], 
        left=int(a['mark']['x']), 
        top=int(a['mark']['y']),
        right=int(a['mark']['x'] + a['mark']['width']),
        bottom=int(a['mark']['y'] + a['mark']['height'])
      ).count()
      if ia_query <= 0:
        ia = ImageAnnotation(
          image_name=req['image_name'], 
          annotation=json.dumps(a),
          left=int(a['mark']['x']),
          top=int(a['mark']['y']),
          right=int(a['mark']['x'] + a['mark']['width']),
          bottom=int(a['mark']['y'] + a['mark']['height'])
        )
        db.session.add(ia)
        db.session.commit()
    
    return jsonify({"msg": f"Annotation data is saved successfully", "status": 200}), 200
  return jsonify({"msg": f"Request Method not allowed!", "status": 405}), 405 

@user.route('/project/image/<image_name>/details', methods=['GET'])
@jwt_required()
def annotationImageData(image_name):
  ia = ImageAnnotation.query.filter_by(image_name=image_name)
  if ia.count() <= 0:
    return jsonify({"msg": "There is no annotation saved for this image", "status": 404}), 404

  annotation_data = []
  for i in ia:
    annotation_data.append(json.loads(i.annotation))
  return jsonify({"msg": "Annotations are imported successfully", "status": 200, "annotations":annotation_data}), 200
  


@user.route('/project/image/<image_name>/download', methods=['GET', 'POST'])
@jwt_required()
def downloadAnnotation(image_name):
  ia = ImageAnnotation.query.filter_by(image_name=image_name)
  if ia.count() <= 0:
    return jsonify({"msg": "There is no annotation saved for this image", "status": 404}), 404
  
  content = ''
  for i in ia:
    content += f'''{i.image_name},{i.left},{i.top},{i.right},{i.bottom}\n'''
  
  return jsonify({"msg":"Your data is successfully collected", "status": 200, "content": content}), 200
