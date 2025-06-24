from flask import Blueprint, request, jsonify

from models import db, Person, Property
from routes.utils import save_file

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/people', methods=['POST'])
def create_person():
        name = request.form.get('name')
        gender = request.form.get('gender')
        city = request.form.get('city')
        contact = request.form.get('contact')
        hobbies = request.form.get('hobbies', '').split(',')
        description = request.form.get('description')
        looking_for = request.form.get('looking_for')
        preferences = {
            "smoking": request.form.get("smoking"),
            "pets": request.form.get("pets"),
            "food": request.form.get("food")
        }

        # Save Person first so we get ID
        person = Person(
            name=name, gender=gender, city=city, contact=contact,
            hobbies=hobbies, description=description,
            looking_for=looking_for, preferences=preferences
        )
        db.session.add(person)
        db.session.commit()

        # Now save files using person.id
        profile_file = request.files.get('profile_picture')
        gov_id_file = request.files.get('government_id')

        person.profile_picture = save_file(profile_file, f"person_{person.id}_profile")
        person.government_id = save_file(gov_id_file, f"person_{person.id}_govid")

        db.session.commit()
        return {"message": "Person uploaded successfully"}


@upload_bp.route('/properties', methods=['POST'])
def create_property():
    # Step 1: Extract form fields
    name = request.form.get('name')
    contact = request.form.get('contact')
    city = request.form.get('city')
    address = request.form.get('address')
    rent = {
        "single": int(request.form.get('rent_single', 0)),
        "double": int(request.form.get('rent_double', 0)),
        "triple": int(request.form.get('rent_triple', 0)),
    }
    security_amount = request.form.get('security_amount', type=float)
    electricity_rate = request.form.get('electricity_rate', type=float)
    amenities = request.form.getlist('amenities')
    gender_preference = request.form.get('gender_preference', 'any')

    # Step 2: Create Property instance
    prop = Property(
        name=name,
        contact=contact,
        city=city,
        address=address,
        rent=rent,
        security_amount=security_amount,
        electricity_rate=electricity_rate,
        amenities=amenities,
        gender_preference=gender_preference
    )
    db.session.add(prop)
    db.session.commit()  # So we have the prop.id available

    # Step 3: Upload government ID
    government_id_file = request.files.get('government_id')
    if government_id_file:
        prop.government_id = save_file(government_id_file, f"property_{prop.id}_govid")

    # Step 4: Upload pictures with validations
    image_files = request.files.getlist('pictures')
    if len(image_files) > 3:
        return jsonify({"error": "You can upload a maximum of 3 images."}), 400

    MAX_IMAGE_SIZE = 1 * 1024 * 1024  # 1MB

    picture_paths = []
    for i, img in enumerate(image_files):
        img.seek(0, 2)  # Seek to end
        size = img.tell()
        img.seek(0)  # Reset
        if size > MAX_IMAGE_SIZE:
            return jsonify({"error": f"Image {img.filename} exceeds 1MB size limit."}), 400
        path = save_file(img, f"property_{prop.id}_img{i + 1}")
        if path:
            picture_paths.append(path)

    prop.pictures = picture_paths

    # Step 5: Save all changes
    db.session.commit()

    return jsonify({
        "message": "Property added successfully",
        "id": prop.id,
        "pictures": picture_paths,
        "government_id": prop.government_id
    }), 201
