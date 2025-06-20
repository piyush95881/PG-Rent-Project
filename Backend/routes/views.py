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

@views_bp.route('/add-person', methods=['GET', 'POST'])
def add_person():
    return render_template('add_person.html')

@views_bp.route('/add-property', methods=['GET', 'POST'])
def add_property():
    return render_template('add_property.html')

@views_bp.route('/login')
def show_login():
    return render_template("login.html")

@views_bp.route('/generate-form')
def show_form():
    return render_template("generate_agreement_form.html")

@views_bp.route('/navbar.html')
def serve_navbar():
    return render_template('navbar.html')

@views_bp.route('/profile')
def serve_profile():
    return render_template('prof_index.html')
