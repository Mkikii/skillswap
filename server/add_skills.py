from app import app, db
from models import Skill

with app.app_context():
    print("Adding sample skills...")
    
    skills = [
        {"name": "Python Programming", "category": "Technology"},
        {"name": "JavaScript", "category": "Technology"},
        {"name": "Web Development", "category": "Technology"},
        {"name": "Guitar Lessons", "category": "Music"},
        {"name": "Cooking", "category": "Lifestyle"},
        {"name": "Photography", "category": "Creative"},
        {"name": "Yoga", "category": "Fitness"},
        {"name": "Spanish Language", "category": "Language"}
    ]
    
    for skill_data in skills:
        skill = Skill(**skill_data)
        db.session.add(skill)
    
    db.session.commit()
    print(f"Added {len(skills)} skills to the database!")
   
    all_skills = Skill.query.all()
    print(f"Total skills now: {len(all_skills)}")
    for skill in all_skills:
        print(f" - {skill.name} ({skill.category})")
