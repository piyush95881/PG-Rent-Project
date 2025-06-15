from flask import Blueprint, request, jsonify
from models import db, Person, Property

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/people/create', methods=['POST'])
def create_person():
    data = request.get_json()
    person = Person(
        name=data['name'],
        gender=data['gender'],
        contact=data['contact'],
        city=data['city'],
        looking_for=data['looking_for'],
        hobbies=data.get('hobbies', []),
        description=data.get('description', ''),
        preferences=data.get('preferences', {})
    )
    db.session.add(person)
    db.session.commit()
    return jsonify({"message": "Person added", "id": person.id}), 201

@upload_bp.route('/properties/create', methods=['POST'])
def create_property():
    data = request.get_json()
    prop = Property(
        name=data['name'],
        contact=data['contact'],
        city=data['city'],
        rent=data['rent'],
        security_amount=data['security_amount'],
        electricity_rate=data['electricity_rate'],
        amenities=data.get('amenities', []),
        pictures=data.get('pictures', [])
    )
    db.session.add(prop)
    db.session.commit()
    return jsonify({"message": "Property added", "id": prop.id}), 201
