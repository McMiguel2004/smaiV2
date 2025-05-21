from flask import jsonify
from ..utils import token_required

@token_required
def get_current_user(current_user):
    """
    Get current authenticated user
    """
    return jsonify(current_user.to_dict())
