from flask import jsonify
from ..models import db
from ..utils import token_required

@token_required
def logout(current_user):
    """
    Logout a user and invalidate tokens
    """
    try:
        # Invalidate tokens
        current_user.invalidate_tokens()
        db.session.commit()

        # Create response
        response = jsonify({'message': 'Successfully logged out'})

        # Delete cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500
