from flask import Blueprint, request, jsonify
from models import Person, Property
from extensions import db

search_bp = Blueprint('search', __name__)


@search_bp.route('/people', methods=['GET'])
def get_people():
    query = Person.query
    city = request.args.get('city')
    looking_for = request.args.get('looking_for')

    if city:
        query = query.filter(Person.city.ilike(f"%{city}%"))
    if looking_for:
        query = query.filter(Person.looking_for == looking_for)

    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    people = query.paginate(page=page, per_page=limit, error_out=False)

    result = [{
        "id": p.id,
        "name": p.name,
        "gender": p.gender,
        "contact": p.contact,
        "looking_for": p.looking_for,
        "hobbies": p.hobbies,
        "description": p.description,
        "preferences": p.preferences,
    } for p in people.items]

    return jsonify({
        "total": people.total,
        "pages": people.pages,
        "current_page": people.page,
        "results": result
    })


@search_bp.route('/properties', methods=['GET'])
def get_properties():
    query = Property.query
    city = request.args.get('city')
    max_rent = request.args.get('max_rent', type=int)

    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if max_rent:
        query = query.filter(
            (Property.rent['single'].as_integer() <= max_rent) |
            (Property.rent['double'].as_integer() <= max_rent) |
            (Property.rent['triple'].as_integer() <= max_rent)
        )

    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    properties = query.paginate(page=page, per_page=limit, error_out=False)

    result = [{
        "id": p.id,
        "name": p.name,
        "contact": p.contact,
        "city": p.city,
        "rent": p.rent,
        "security_amount": float(p.security_amount),
        "electricity_rate": float(p.electricity_rate),
        "amenities": p.amenities,
        "pictures": p.pictures,
    } for p in properties.items]

    return jsonify({
        "total": properties.total,
        "pages": properties.pages,
        "current_page": properties.page,
        "results": result
    })

# GET /api/people/search?city=Delhi&looking_for=roommate
# GET /api/properties/search?city=Dehradun&min_rent=4000&max_rent=8000
