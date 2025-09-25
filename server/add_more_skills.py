from app import app, db
from models import Skill

with app.app_context():
    print("Adding more sample skills...")
    
    skills_data = [
        {"name": "JavaScript", "category": "Technology"},
        {"name": "Web Development", "category": "Technology"},
        {"name": "Guitar Lessons", "category": "Music"},
        {"name": "Cooking", "category": "Lifestyle"},
        {"name": "Photography", "category": "Creative"},
        {"name": "Yoga", "category": "Fitness"},
        {"name": "Spanish Language", "category": "Language"}
    ]
    
    added_count = 0
    for skill_data in skills_data:
        # Check if skill already exists
        existing_skill = Skill.query.filter_by(name=skill_data['name']).first()
        if not existing_skill:
            skill = Skill(**skill_data)
            db.session.add(skill)
            added_count += 1
            print(f"Added: {skill_data['name']}")
        else:
            print(f"Already exists: {skill_data['name']}")
    
    db.session.commit()
    print(f"Successfully added {added_count} new skills!")
    
    # Show all skills
    all_skills = Skill.query.all()
    print(f"Total skills in database: {len(all_skills)}")
    for skill in all_skills:
        print(f" - {skill.name} ({skill.category})")
