    # Filter by user if specified (reviews received by this user)
    if user_id:
        query = query.filter(Review.reviewee_id == user_id)
    
    # Order by creation date (newest first)
    query = query.order_by(Review.created_at.desc())
    
    # Paginate results
    reviews = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    return jsonify({
        'reviews': [review.to_dict() for review in reviews.items],
        'total': reviews.total,
        'pages': reviews.pages,
        'current_page': page,
        'per_page': per_page
    }), 200
    
except Exception as e:
    return jsonify({'error': 'Failed to fetch reviews'}), 500