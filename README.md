# 🏠 Roommate – Find Your Perfect Roommate or Rental

Roommate is a modern web application that helps users find roommates, rooms, and rental properties with ease. It allows listing properties, matching with flatmates, and even generating rental agreements.

## 🚀 Features

- 🔍 Search for roommates or rental properties
- ✍️ List your property or roommate preferences
- 📄 Generate downloadable rental agreements (PDF)
- 📬 Email agreements to involved parties
- ❤️ Wishlist and profile support
- 🛡️ Secure endpoints with JWT authentication

---

## 📦 Tech Stack

| Frontend             | Backend            | Other              |
|----------------------|--------------------|---------------------|
| HTML, CSS, JS        | Flask (Python)     | Flask-Mail, JWT     |
| Bootstrap / Tailwind | Flask Blueprints   | WeasyPrint (PDF)    |
| Vanilla JS           | RESTful APIs       | SQLite / MongoDB    |

---

## 💠 Setup Instructions

### 1. 📁 Clone the Repository

```bash
https://github.com/piyush95881/PG-Rent-Project.git
cd PG-Rent-Project
```

---

### 2. 🐍 Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

---

### 3. 📦 Install Backend Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` is missing, install manually:

```bash
pip install Flask Flask-Mail Flask-JWT-Extended WeasyPrint
```

> **Note:** On Linux, `WeasyPrint` may require:
> ```bash
> sudo apt install libpango1.0-dev libgdk-pixbuf2.0-dev libffi-dev libcairo2
> ```

---

### 4. ⚙️ Set Environment Variables

Create a `.env` file in the root directory and add:

```ini
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_password_or_app_password
MAIL_USE_TLS=True
```

---

### 5. 🧪 Run the Server

```bash
.\run.ps1 
```

By default, the app will be available at:  
**http://127.0.0.1:5000**

---

## 💽 Frontend Structure

The frontend is served with Flask using templates and static files.

**Key Pages:**

- `/` – Home Page
- `/find-roommates` – Match search page
- `/details` – Dynamic detail page
- `/generate-agreement` – PDF generation route (POST)

---

## 🥪 Testing the PDF Generation

To test rental agreement creation:

1. Login and get your JWT token.
2. Send a POST request to `/generate-agreement` with JSON:
```json
{
  "owner": {...},
  "tenant": {...},
  "property": {...},
  "terms": {
    "email": "test@example.com"
  },
  "annexures": [...]
}
```

The server will generate a PDF and email it to the provided address.

---

## 🧩 Folder Structure

```
flatmate-app/
🗂️ static/              # CSS, JS, images
🗂️ templates/           # HTML templates
🗂️ agreements/          # Generated PDF files
🗂️ routes/              # Flask Blueprints (agreement.py, auth.py, etc.)
🗋 app.py               # Main Flask entrypoint
🗋 extensions.py        # Init for mail, jwt, db
🗋 .env                 # Environment secrets
🗋 README.md
```

---

## 📧 Contact / Contribute

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---




## System Requirements for WeasyPrint

> WeasyPrint requires GTK libraries (Pango, GDK-PixBuf, Cairo) installed on your system.

On Windows:

1. Download and install the GTK runtime:
   https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer

2. Add GTK's `bin/` folder to your PATH.

On Ubuntu/Debian (Linux):

```bash
sudo apt install libpango-1.0-0 libcairo2 libgdk-pixbuf2.0-0 libffi-dev
