from flask import Blueprint, request, jsonify

from models import Person, Property

details_bp = Blueprint('details', __name__, url_prefix='/api')

@details_bp.route('/details', methods=['GET'])
def get_details():
    item_id = request.args.get('id')
    item_type = request.args.get('type')

    if not item_id or not item_type:
        return jsonify({'error': 'Missing parameters: id and type required'}), 400

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
            'profile_picture': getattr(person, 'profile_picture', None),
            # 'government_id': getattr(person, 'government_id', None)
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
            'gender_preference': getattr(prop, 'gender_preference', 'any'),
            # 'government_id': getattr(prop, 'government_id', None)
        })

    return jsonify({'error': 'Invalid type: must be "people" or "properties"'}), 400
