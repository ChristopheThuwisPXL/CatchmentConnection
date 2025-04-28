from flask import request, jsonify
from services.auth_service import signup_user, login_user

def register_auth_routes(app):
    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        response = signup_user(data.get('email'), data.get('password'))

        if not response.user:
            return jsonify({"error": "Signup failed, please try again."}), 400

        return jsonify({"message": "Signup successful. Please confirm your email."}), 200


    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({"error": "Email and password are required."}), 400

        try:
            response = login_user(email, password)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        if not response.session:
            return jsonify({"error": "Invalid email or password"}), 401

        user_data = {
            "id": response.user.id,
            "email": response.user.email,
            "created_at": response.user.created_at,
            "role": response.user.role
        }

        return jsonify({
            "user": user_data,
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token
        }), 200
