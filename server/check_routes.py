from app import app

print("🔍 Checking registered routes:")
for rule in app.url_map.iter_rules():
    methods = ','.join(sorted(rule.methods))
    print(f"📍 {rule.endpoint:30} {methods:20} {rule.rule}")

print(f"\n📊 Total routes: {len(list(app.url_map.iter_rules()))}")
