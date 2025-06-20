import os
from werkzeug.utils import secure_filename
from flask import current_app

def save_file(file, prefix):
    if not file:
        return None
    filename = secure_filename(file.filename)
    ext = filename.rsplit('.', 1)[-1]
    new_filename = f"{prefix}.{ext}"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], new_filename)
    file.save(filepath)
    return f"uploads/{new_filename}"
