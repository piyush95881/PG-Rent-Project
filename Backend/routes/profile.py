from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User

user_bp = Blueprint('user', __name__, url_prefix='/api/user')


@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    user.name = data.get('name', user.name)
    user.gender = data.get('gender', user.gender)
    user.age = data.get('age', user.age)
    user.contact = data.get('contact', user.contact)
    user.address = data.get('address', user.address)
    user.hobbies = data.get('hobbies', user.hobbies)

    db.session.commit()
    return jsonify({"msg": "Profile updated successfully"}), 200

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "gender": user.gender,
        "age": user.age,
        "contact": user.contact,
        "address": user.address,
        "hobbies": user.hobbies,
    })

@user_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User account deleted"}), 200

@user_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Invalidate the token on the frontend (no real blacklisting without setup)
    return jsonify({"msg": "Logout successful. Please delete token on client."}), 200
