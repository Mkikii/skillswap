@listings_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f" Received create listing request: {data}")
        
        # More flexible validation
        if not data:
            return jsonify({'error': 'No data provided'}), 422
            
        required_fields = ['title', 'description', 'price_per_hour', 'skill_id']
        missing_fields = []
        
        for field in required_fields:
            if field not in data:
                missing_fields.append(field)
        
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 422
        
        # Convert values with better error handling
        try:
            price = float(data['price_per_hour'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Price must be a valid number'}), 422
        
        if price <= 0 or price > 999:
            return jsonify({'error': 'Price must be between 1 and 999 KSh'}), 422
        
        try:
            skill_id = int(data['skill_id'])
        except (ValueError, TypeError):
            return jsonify({'error': 'Skill ID must be a valid number'}), 422
        
        skill = Skill.query.get(skill_id)
        if not skill:
            return jsonify({'error': 'Skill not found'}), 404
        
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Create listing
        listing = Listing(
            title=str(data['title']).strip(),
            description=str(data['description']).strip(),
            price_per_hour=price,
            user_id=current_user_id,
            skill_id=skill_id
        )
        
        db.session.add(listing)
        db.session.commit()
        
        return jsonify({
            'message': 'Listing created successfully',
            'listing': {
                'id': listing.id,
                'title': listing.title,
                'description': listing.description,
                'price_per_hour': listing.price_per_hour,
                'skill_id': listing.skill_id
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f" Create listing error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500