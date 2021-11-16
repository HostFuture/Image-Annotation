from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta


# Basic API Variable Defination
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///backend.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '33BB3757DAB87A786ADB2382778D10BBB44BE45DBCA45717455E950CA9B8AC84'
app.config['JWT_SECRET_KEY'] = '836846B238319CD989FE69D9B347A77C2B34179EBAFEBCF5E93F9D9F4841989B'
app.config['PASSWORD_TOKEN'] = 'B3E1C2CB1A12D364881DAC99F19E8F79'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)


# Basic API Configuration
db = SQLAlchemy(app)
jwt = JWTManager(app)

from backend.user.views import user
app.register_blueprint(user)

# Error Handling
@app.errorhandler(404)
def page_not_found(e):
  return jsonify({"msg": str(e), "status": 404}), 404

# Creating and Syncing changes in database
db.create_all()