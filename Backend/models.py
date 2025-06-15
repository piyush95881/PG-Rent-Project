from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import ARRAY, JSON, NUMERIC

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

class Person(db.Model):
    __tablename__ = 'people'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(10))
    contact = db.Column(db.String(20))
    city = db.Column(db.String(100))
    looking_for = db.Column(db.String(20))  # 'room' or 'roommate'
    hobbies = db.Column(ARRAY(db.String))   # list of strings
    description = db.Column(db.Text)
    preferences = db.Column(JSON)           # e.g., {"smoking": False, "pets": True}

class Property(db.Model):
    __tablename__ = 'properties'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))  # Name of PG/flat
    contact = db.Column(db.String(20))
    city = db.Column(db.String(100))
    address = db.Column(db.String(200))
    rent = db.Column(JSON)            # e.g., {"single": 9000, "double": 6000, "triple": 4000}
    security_amount = db.Column(NUMERIC(10, 2))
    electricity_rate = db.Column(NUMERIC(5, 2))
    amenities = db.Column(ARRAY(db.String))
    pictures = db.Column(ARRAY(db.String))  # list of image URLs