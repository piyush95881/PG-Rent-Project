# routes/views.py

from flask import Blueprint, render_template

views_bp = Blueprint('views', __name__)


@views_bp.route('/')
def home():
    return render_template('index.html')


@views_bp.route('/search')
def search_page():
    return render_template("search.html")


@views_bp.route('/details')
def details():
    return render_template('details.html')


@views_bp.route('/add-listing')
def add_listing():
    return render_template('add-listing.html')


@views_bp.route('/login')
def show_login():
    return render_template("login.html")


@views_bp.route('/generate-form')
def show_form():
    return render_template("rent-agreement.html")


@views_bp.route('/profile')
def serve_profile():
    return render_template('profile.html')
