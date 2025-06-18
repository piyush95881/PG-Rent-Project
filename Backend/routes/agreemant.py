# routes/agreement.py

import os
from uuid import uuid4

from flask import Blueprint, request, send_file, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from extensions import mail

agreement_bp = Blueprint('agreement', __name__)
@agreement_bp.route('/generate-agreement', methods=['POST'])
@jwt_required()
def generate_agreement():
    # print("🔐 JWT Identity:", get_jwt_identity())
    print("Generating Agreement")
    from weasyprint import HTML  # <-- moved here

    data = request.get_json()
    required_fields = ['owner', 'tenant', 'property', 'terms', 'annexures']
    if not all(key in data for key in required_fields):
        return {"error": "Missing fields in request"}, 400

    filename = f"rental_agreement_{uuid4().hex}.pdf"
    filepath = os.path.join("agreements", filename)
    missing = [key for key in required_fields if key not in data]
    if missing:
        print(missing)

    html = render_template("rental_agreement.html",
                           owner=data['owner'],
                           tenant=data['tenant'],
                           property=data['property'],
                           terms=data['terms'],
                           annexures=data['annexures'])

    HTML(string=html).write_pdf(filepath)

    SEND_EMAIL = True
    # Email the agreement
    if SEND_EMAIL:
        recipient_email = data['terms'].get('email')
        if recipient_email:
            msg = Message("Your Rental Agreement", recipients=[recipient_email])
            msg.body = "Please find your rental agreement attached."
            with open(filepath, 'rb') as f:
                msg.attach(filename, "application/pdf", f.read())
            mail.send(msg)

    return send_file(filepath, as_attachment=True)
