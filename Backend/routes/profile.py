from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User
from werkzeug.utils import secure_filename
import os

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

UPLOAD_FOLDER = 'uploads/user_ids'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
MAX_FILE_SIZE_MB = 1

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@user_bp.route('/profile/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    try:
        # Handle JSON + form fields
        data = request.form.to_dict()
        hobbies = request.form.getlist('hobbies')
        user.name = data.get('name', user.name)
        user.gender = data.get('gender', user.gender)
        user.age = data.get('age', user.age)
        user.contact = data.get('contact', user.contact)
        user.address = data.get('address', user.address)
        if hobbies:
            user.hobbies = hobbies

        # Handle profile picture upload
        profile_pic = request.files.get('profile_picture')
        if profile_pic and allowed_file(profile_pic.filename):
            if len(profile_pic.read()) > MAX_FILE_SIZE_MB * 1024 * 1024:
                return jsonify({"msg": "File exceeds max 1MB"}), 400
            profile_pic.seek(0)  # reset pointer
            filename = secure_filename(f"user_{user_id}_profile.{profile_pic.filename.rsplit('.', 1)[1].lower()}")
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            profile_pic.save(filepath)
            user.profile_picture = filepath  # assuming this column exists in your User model

        db.session.commit()
        return jsonify({
            "msg": "Profile updated successfully",
            "user": {
                "username": user.username,
                "email": user.email,
                "name": user.name,
                "gender": user.gender,
                "age": user.age,
                "contact": user.contact,
                "address": user.address,
                "hobbies": user.hobbies,
                "profile_picture": getattr(user, "profile_picture", None)
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "An error occurred", "error": str(e)}), 500


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
        "profile_picture": getattr(user, "profile_picture", None)

    })


@user_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Soft delete option
    # user.is_active = False
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User account deleted"}), 200


@user_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({"msg": "Logout successful. Please delete token on client."}), 200
