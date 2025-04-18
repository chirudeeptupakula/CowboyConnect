from app.database import SessionLocal
from app.models import Club

def seed_clubs():
    db = SessionLocal()

    default_clubs = [
        {"name": "AI Club", "description": "Explore the latest in artificial intelligence."},
        {"name": "Robotics Club", "description": "Build robots and compete nationally."},
        {"name": "Coding Ninjas", "description": "Weekly LeetCode practice and contests."},
        {"name": "Eco Warriors", "description": "Run sustainability and green campus initiatives."},
        {"name": "Cultural Committee", "description": "Organize fests, talent shows, and more."}
    ]

    for club in default_clubs:
        exists = db.query(Club).filter(Club.name == club["name"]).first()
        if not exists:
            db.add(Club(name=club["name"], description=club["description"]))

    db.commit()
    db.close()
    print("✅ Default clubs seeded successfully.")

if __name__ == "__main__":
    seed_clubs()
