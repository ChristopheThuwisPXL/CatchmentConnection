from flask import request, jsonify,session
from services.auth_service import signup_user, login_user
from gotrue.errors import AuthWeakPasswordError, AuthApiError
from datetime import timedelta

def register_auth_routes(app):
    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        result = signup_user(email, password)

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result), 200



    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        try:
            response = login_user(email, password)
            print(f"Login successful: {response}")  # Log the full response for debugging
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

        if not response.session:
            return jsonify({"error": "Invalid email or password"}), 401

        # Log the session and user details for debugging
        print(f"User data: {response.user}")
        print(f"Session details: {response.session}")

        user_data = {
            "id": response.user.id,
            "email": response.user.email,
            "created_at": response.user.created_at,
            "role": response.user.role
        }

        # Store session data in cookies for persistence across requests
        session.permanent = True  # Make session permanent
        session['user_id'] = response.user.id
        session['access_token'] = response.session.access_token
        session['refresh_token'] = response.session.refresh_token

        return jsonify({
            "user": user_data,
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token
        }), 200
