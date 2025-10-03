@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    try:
        listing = Listing.query.get(listing_id)
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404
        
        listing_data = {
            'id': listing.id,
            'title': listing.title,
            'description': listing.description,
            'price_per_hour': listing.price_per_hour,
            'created_at': listing.created_at.isoformat(),
            'skill_name': listing.skill.name,
            'skill_category': listing.skill.category,
            'teacher_username': listing.user.username,
            'teacher_id': listing.user_id,
            'teacher': {
                'id': listing.user.id,
                'username': listing.user.username,
                'email': listing.user.email,
                'bio': listing.user.bio
            },
            'skill': {
                'id': listing.skill.id,
                'name': listing.skill.name,
                'category': listing.skill.category
            }
        }
        
        reviews = Review.query.filter_by(reviewee_id=listing.user_id).all()
        avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
        listing_data['teacher_rating'] = round(avg_rating, 1)
        listing_data['teacher_review_count'] = len(reviews)
        
        return jsonify({'listing': listing_data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch listing'}), 500