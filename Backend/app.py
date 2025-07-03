from dotenv import load_dotenv  # we cannot load .env directly either we will have to make it a py file else use dotenv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended.exceptions import JWTExtendedException

from config import Config
from extensions import db, jwt, mail, migrate
from routes import *

load_dotenv()


def create_app():
    app = Flask(__name__, template_folder="../Frontend/templates", static_folder="../Frontend/static",
                static_url_path="/static", instance_relative_config=True)
    app.config.from_object(Config)
    CORS(app,
         supports_credentials=True)  # CORS (Cross-Origin Resource Sharing). supports_credentials=True allows cookies or HTTP auth headers to be sent across origins.

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(agreement_bp, url_prefix='/api/agreement')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(details_bp)
    app.register_blueprint(views_bp)

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_error(e):
        print("🔐 JWT error:", str(e))  # This will show in your console
        return jsonify({"msg": str(e)}), 401

    return app
