from flask import Blueprint, request, jsonify
from models import Person, Property  # adjust if your model is elsewhere
from extensions import db

details_bp = Blueprint('details', __name__)

@details_bp.route('/api/details')
def get_details():
    item_id = request.args.get('id')
    item_type = request.args.get('type')

    if not item_id or not item_type:
        return jsonify({'error': 'Missing parameters'}), 400

    if item_type == 'people':
        person = Person.query.get(item_id)
        if not person:
            return jsonify({'error': 'Person not found'}), 404

        return jsonify({
            'id': person.id,
            'name': person.name,
            'gender': person.gender,
            'city': person.city,
            'looking_for': person.looking_for,
            'hobbies': person.hobbies,
            'description': person.description,
            'preferences': person.preferences,
            'contact': person.contact,
        })

    elif item_type == 'properties':
        prop = Property.query.get(item_id)
        if not prop:
            return jsonify({'error': 'Property not found'}), 404

        return jsonify({
            'id': prop.id,
            'name': prop.name,
            'city': prop.city,
            'address': prop.address,
            'rent': prop.rent,
            'security_amount': float(prop.security_amount),
            'electricity_rate': float(prop.electricity_rate),
            'amenities': prop.amenities,
            'pictures': prop.pictures,
            'contact': prop.contact,
        })

    return jsonify({'error': 'Invalid type'}), 400
