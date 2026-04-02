from app import db
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Travel preferences
    favorite_destination_type = db.Column(db.String(100))
    budget_preference = db.Column(db.String(50))
    travel_interests = db.Column(db.Text)
    
    def __repr__(self):
        return f'<User {self.username}>'

class TravelPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    origin = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    travel_duration = db.Column(db.Integer, nullable=False)
    budget_range = db.Column(db.String(50))
    interests = db.Column(db.Text)
    generated_itinerary = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<TravelPlan {self.origin} to {self.destination}>'