from app import app, db  # import your Flask app and db

# Use the app's context
with app.app_context():
    db.drop_all()   # optional: drop existing tables
    db.create_all() # create fresh tables
    print("New database created with proper tables!")
