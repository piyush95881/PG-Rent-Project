from datetime import datetime, UTC

from sqlalchemy.dialects.postgresql import ARRAY, JSON, NUMERIC
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    name = db.Column(db.String(100))
    gender = db.Column(db.String(10))  # Male, Female, Other
    age = db.Column(db.Integer)
    contact = db.Column(db.String(15))
    address = db.Column(db.String(200))
    occupation = db.Column(db.String(128))
    company = db.Column(db.String(128))
    income = db.Column(db.String(32))
    preferred_gender = db.Column(db.String(16))
    bio = db.Column(db.Text)
    hobbies = db.Column(ARRAY(db.String))
    profile_picture = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))

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
    age = db.Column(db.Integer)
    contact = db.Column(db.String(20))
    city = db.Column(db.String(100))
    occupation = db.Column(db.String(50))  # Student, Professional, etc.
    budget = db.Column(db.Integer)
    hobbies = db.Column(ARRAY(db.String))
    description = db.Column(db.Text)
    address = db.Column(db.String(200))

    preferences = db.Column(JSON)  # smoking, pets, food
    looking_for = db.Column(db.String(20))  # room / roommate
    profile_picture = db.Column(db.String(300))  # file path to uploaded image
    government_id = db.Column(db.String(300))  # file path to uploaded govt ID
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))


class Property(db.Model):
    __tablename__ = 'properties'
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(150), nullable=False)
    contact = db.Column(db.String(20))
    city = db.Column(db.String(100))
    address = db.Column(db.String(200))

    rent = db.Column(JSON)  # {"single": 9000, "double": 6000}
    security_amount = db.Column(NUMERIC(10, 2))
    electricity_rate = db.Column(NUMERIC(5, 2))

    amenities = db.Column(ARRAY(db.String))
    room_types = db.Column(JSON)  # {"single": True, "double": True, "triple": False}
    furnished = db.Column(db.Boolean, default=False)
    food_included = db.Column(db.Boolean, default=False)
    laundry_available = db.Column(db.Boolean, default=False)

    available_from = db.Column(db.Date)
    gender_preference = db.Column(db.String(20), default="any")  # male/female/any
    distance_from_college_or_office = db.Column(db.String(50))

    pictures = db.Column(ARRAY(db.String))  # List of file paths to uploaded images
    government_id = db.Column(db.String(300))  # file path to uploaded govt ID
    created_at = db.Column(db.DateTime, default=datetime.now(UTC))
