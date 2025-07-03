# routes/agreement.py

import os
from uuid import uuid4

from flask import Blueprint, request, send_file, render_template
from flask_jwt_extended import jwt_required
from flask_mail import Message

from extensions import mail

agreement_bp = Blueprint('agreement', __name__)
@agreement_bp.route('/generate-agreement', methods=['POST'])
@jwt_required()
def generate_agreement():
    from weasyprint import HTML

    data = request.get_json()
    required_fields = ['owner', 'tenant', 'property', 'terms', 'annexures']
    if not all(key in data for key in required_fields):
        return {"error": "Missing fields in request"}, 400

    filename = f"rental_agreement_{uuid4().hex}.pdf"
    filepath = os.path.join("agreements", filename)

    html = render_template("rental_agreement.html",
                           owner=data['owner'],
                           tenant=data['tenant'],
                           property=data['property'],
                           terms=data['terms'],
                           annexures=data['annexures'])

    HTML(string=html).write_pdf(filepath)

    SEND_EMAIL = True
    if SEND_EMAIL:
        recipient_email = data['terms'].get('email')

        if recipient_email:
            subject = "📝 Your Rental Agreement from Roommate"
            body = f"""
Hello {data['tenant'].get('name', 'Tenant')} and {data['owner'].get('name', 'Owner')},

Thank you for using our service. Please find attached your rental agreement.

If you have any questions, feel free to contact us at support.roommate@gmail.com.

Regards,  
Roommate Team
            """

            msg = Message(subject, recipients=[recipient_email])
            msg.body = body

            try:
                with open(filepath, 'rb') as f:
                    msg.attach(filename, "application/pdf", f.read())
                mail.send(msg)
                print(f"✅ Email sent to {recipient_email}")
            except Exception as e:
                print(f"❌ Failed to send email: {e}")

    # ✅ Always return the file
    return send_file(filepath, as_attachment=True)
