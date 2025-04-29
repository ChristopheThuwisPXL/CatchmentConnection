from functools import wraps
from flask import request, jsonify
from repository.supabase_client import supabase

def get_token():
    """
    Extracts the Bearer token from the Authorization header.
    Returns None if the token is missing or malformed.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    return auth_header.split(" ")[1]


def get_user_from_token():
    """
    Retrieves the user associated with the token by making a request to Supabase.
    Returns a tuple (user, error_response, status_code).
    """
    token = get_token()
    if not token:
        return None, jsonify({'message': 'Missing token'}), 401

    try:
        user_response = supabase.auth.get_user(token)
        if user_response.get("error"):
            return None, jsonify({'message': 'Invalid token'}), 401
        return user_response["user"], None, None
    except Exception as e:
        return None, jsonify({'message': str(e)}), 500


def account_routes(app):
    """
    Registers the account routes with the Flask app.
    """
    @app.route('/user', methods=['GET'])
    def get_user():
        try:
            user_id = request.args.get('user_id')  # Ensure this is passed in the URL
            if not user_id:
                return jsonify({"message": "User ID is required"}), 400

            # Try to query the users table
            user_data = supabase.table("users").select("*").eq("id", user_id).execute()

            if user_data.error:
                print(f"Error fetching user data: {user_data.error}")
                return jsonify({"message": f"Error fetching user data: {user_data.error}"}), 500

            if user_data.data:
                return jsonify(user_data.data), 200
            else:
                return jsonify({"message": "User not found"}), 404

        except Exception as e:
            print(f"Error in get_user: {e}")
            return jsonify({"message": "Internal server error"}), 500

    @app.route('/user', methods=['PUT'])
    def update_user():
        """
        Updates the user profile (name and/or email).
        """
        token = get_token()
        user, error_response, status_code = get_user_from_token()
        if error_response:
            return error_response, status_code

        name = request.json.get('name')
        email = request.json.get('email')

        # Validation for the name and email
        if name and len(name) < 3:
            return jsonify({'message': 'Name must be at least 3 characters long'}), 400
        if email and '@' not in email:
            return jsonify({'message': 'Invalid email address'}), 400

        try:
            update_data = {"data": {"name": name}} if name else {}
            if email:
                update_data["email"] = email

            # Update the user data in Supabase
            result = supabase.auth.update_user(update_data, token=token)
            if result.get("error"):
                return jsonify({'message': 'Update failed', 'error': result['error']}), 400

            return jsonify({'message': 'Profile updated successfully'})

        except Exception as e:
            return jsonify({'message': str(e)}), 500

    @app.route('/change-password', methods=['PATCH'])
    def change_password():
        """
        Changes the user's password.
        """
        token = get_token()
        user, error_response, status_code = get_user_from_token()
        if error_response:
            return error_response, status_code
        
        new_password = request.json.get('newPassword')

        # Basic validation for the password length
        if not new_password or len(new_password) < 8:
            return jsonify({'message': 'Password must be at least 8 characters long'}), 400

        try:
            # Update the password in Supabase
            result = supabase.auth.update_user({"password": new_password}, token=token)
            if result.get("error"):
                return jsonify({'message': 'Password update failed'}), 400

            return jsonify({'message': 'Password updated successfully'})

        except Exception as e:
            return jsonify({'message': str(e)}), 500

    @app.route('/delete-account', methods=['DELETE'])
    def delete_account():
        """
        Deletes the user's account.
        Requires admin privileges for the service role key.
        """
        token = get_token()

        # Ensure the token is available
        if not token:
            return jsonify({'message': 'Token is required'}), 400

        user, error_response, status_code = get_user_from_token()
        if error_response:
            return error_response, status_code

        try:
            # Deleting the current user account (no admin privileges required here)
            result = supabase.auth.delete_user(token=token)
            if result.get("error"):
                return jsonify({'message': 'Deletion failed', 'error': result['error']}), 400

            return jsonify({'message': 'Account deleted successfully'})

        except Exception as e:
            return jsonify({'message': str(e)}), 500
