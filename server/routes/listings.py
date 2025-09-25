from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import api, db
from models import Listing, User, Skill

class ListingList(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            category = request.args.get('category')
            search = request.args.get('search')
            
            query = Listing.query.join(User).join(Skill)
            
            if category:
                query = query.filter(Skill.category == category)
            
            if search:
                query = query.filter(
                    db.or_(
                        Listing.title.contains(search),
                        Listing.description.contains(search),
                        Skill.name.contains(search)
                    )
                )
            
            query = query.order_by(Listing.created_at.desc())
            
            listings = query.paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return {
                'listings': [listing.to_dict() for listing in listings.items],
                'total': listings.total,
                'pages': listings.pages,
                'current_page': page,
                'per_page': per_page
            }, 200
            
        except Exception as e:
            return {'error': 'Failed to fetch listings'}, 500
    
    @jwt_required()
    def post(self):
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json()
            
            required_fields = ['title', 'description', 'price_per_hour', 'skill_id']
            for field in required_fields:
                if not data.get(field):
                    return {'error': f'{field} is required'}, 400
            
            skill = Skill.query.get(data['skill_id'])
            if not skill:
                return {'error': 'Skill not found'}, 404
            try:
                price = float(data['price_per_hour'])
                if price < 0:
                    return {'error': 'Price must be positive'}, 400
            except ValueError:
                return {'error': 'Invalid price format'}, 400
            
            listing = Listing(
                title=data['title'],
                description=data['description'],
                price_per_hour=price,
                user_id=current_user_id,
                skill_id=data['skill_id']
            )
            
            db.session.add(listing)
            db.session.commit()
            
            return {
                'message': 'Listing created successfully',
                'listing': listing.to_dict()
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create listing'}, 500

class ListingDetail(Resource):
    def get(self, listing_id):
        try:
            listing = Listing.query.get(listing_id)
            if not listing:
                return {'error': 'Listing not found'}, 404
            return listing.to_dict(), 200
        except Exception as e:
            return {'error': 'Failed to fetch listing'}, 500
    
    @jwt_required()
    def put(self, listing_id):
        try:
            current_user_id = get_jwt_identity()
            listing = Listing.query.get(listing_id)
            
            if not listing:
                return {'error': 'Listing not found'}, 404
            
            if listing.user_id != current_user_id:
                return {'error': 'Unauthorized to update this listing'}, 403
            
            data = request.get_json()
            
            if 'title' in data:
                listing.title = data['title']
            if 'description' in data:
                listing.description = data['description']
            if 'price_per_hour' in data:
                try:
                    price = float(data['price_per_hour'])
                    if price < 0:
                        return {'error': 'Price must be positive'}, 400
                    listing.price_per_hour = price
                except ValueError:
                    return {'error': 'Invalid price format'}, 400
            if 'skill_id' in data:
                skill = Skill.query.get(data['skill_id'])
                if not skill:
                    return {'error': 'Skill not found'}, 404
                listing.skill_id = data['skill_id']
            
            db.session.commit()
            
            return {
                'message': 'Listing updated successfully',
                'listing': listing.to_dict()
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update listing'}, 500
    
    @jwt_required()
    def delete(self, listing_id):
        try:
            current_user_id = get_jwt_identity()
            listing = Listing.query.get(listing_id)
            
            if not listing:
                return {'error': 'Listing not found'}, 404
            
            if listing.user_id != current_user_id:
                return {'error': 'Unauthorized to delete this listing'}, 403
            
            db.session.delete(listing)
            db.session.commit()
            
            return {'message': 'Listing deleted successfully'}, 200
            
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to delete listing'}, 500

api.add_resource(ListingList, '/api/listings')
api.add_resource(ListingDetail, '/api/listings/<int:listing_id>')
