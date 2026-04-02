from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# SQLite Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_planner.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -----------------
# Database Models
# -----------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

# Create tables
with app.app_context():
    db.create_all()

# -----------------
# Routes
# -----------------

@app.route('/')
def index():
    return render_template('index.html')


# ✅ NEW ROUTE (FIXED ERROR)
@app.route('/generate_plan', methods=['POST'])
def generate_plan():
    destination = request.form.get('destination')
    days = request.form.get('days')
    budget = request.form.get('budget')

    # You can later add AI logic here
    return render_template('result.html',
                           destination=destination,
                           days=days,
                           budget=budget)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate existing user
        if User.query.filter((User.username == username) | (User.email == email)).first():
            flash("Username or Email already exists!", "error")
            return redirect(url_for('register'))

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        flash("Registration successful! Please log in.", "success")
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            flash(f"Welcome, {user.username}!", "success")
            return redirect(url_for('index'))
        else:
            flash("Invalid email or password", "error")
            return redirect(url_for('login'))

    return render_template('login.html')


@app.route('/profile')
def profile():
    user_id = session.get('user_id')
    if not user_id:
        flash("Please log in to view your profile", "warning")
        return redirect(url_for('login'))

    user = User.query.get(user_id)
    return render_template('profile.html', user=user)


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash("Logged out successfully!", "info")
    return redirect(url_for('index'))


# -----------------
# Run App
# -----------------
if __name__ == "__main__":
    app.run()