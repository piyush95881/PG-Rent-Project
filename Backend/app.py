import os

from dotenv import load_dotenv
from flask import Flask, render_template, jsonify
from flask_cors import CORS
from flask_jwt_extended.exceptions import JWTExtendedException
from flask_migrate import Migrate

from config import Config
from routes.auth import auth_bp
from routes.agreemant import agreement_bp
from routes.profile import user_bp
from routes.search import search_bp
from extensions import mail,db,jwt
from routes.upload import upload_bp

# Initialize extensions directly


# Load environment variables
load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, supports_credentials=True)

    migrate = Migrate(app, db)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    # Email config
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)


    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(agreement_bp, url_prefix='/api/agreement')
    app.register_blueprint(search_bp, url_prefix='/api/search')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(user_bp,url_prefix='/api/user')

    @app.errorhandler(JWTExtendedException)
    def handle_jwt_error(e):
        print("🔐 JWT error:", str(e))  # This will show in your console
        return jsonify({"msg": str(e)}), 401

    @app.route('/login')
    def show_login():
        return render_template("login.html")

    @app.route('/generate-form')
    def show_form():
        return render_template("generate_agreement_form.html")

    @app.route('/')
    def home():
        return 'PG Rent API is running!'

    return app

