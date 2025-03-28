from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client

app = Flask(__name__)
CORS(app)

url = "https://pesxumqnmoeeuolluzwa.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlc3h1bXFubW9lZXVvbGx1endhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzExMTMsImV4cCI6MjA1ODUwNzExM30.tfe9kqkQheUx1eB_dxXw87WUopP6RfpRGQWFagsoT-A"
supabase = create_client(url, key)

@app.route("/")
def index():
    return "Welcome to the Flask API!"

@app.route('/signup', methods=['POST'])
def signup():
    try:
        # Get data from the request body
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Attempt signup with Supabase
        signup_response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        # Check if the user was successfully created
        if not signup_response.user:
            return jsonify({"error": "Signup failed, please try again."}), 400

        # Check if the user needs to confirm their email
        if signup_response.user.aud == "authenticated" and signup_response.user.confirmed_at is None:
            return jsonify({
                "message": "Signup successful! Please check your inbox and confirm your email to complete the registration process."
            }), 200
        
        # If signup was successful and email confirmed, send response with tokens (optional if you don't want to log in right away)
        return jsonify({
            "message": "Signup successful. Please check your inbox for the confirmation email."
        }), 200

    except Exception as e:
        # Return any errors that occur as a JSON response
        return jsonify({"error": str(e)}), 500



@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Attempt login
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        # Check if login was successful
        if not response.session:  # If no session, login failed
            return jsonify({"error": "Invalid email or password"}), 401

        # Convert User object to dictionary
        user_data = {
            "id": response.user.id,
            "email": response.user.email,
            "created_at": response.user.created_at,
            "role": response.user.role  # If user has a role
        }

        return jsonify({
            "user": user_data,
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Always return JSON on errors


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


