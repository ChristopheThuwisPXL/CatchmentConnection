from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client

app = Flask(__name__)
CORS(app)

url = "https://pesxumqnmoeeuolluzwa.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlc3h1bXFubW9lZXVvbGx1endhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzExMTMsImV4cCI6MjA1ODUwNzExM30.tfe9kqkQheUx1eB_dxXw87WUopP6RfpRGQWFagsoT-A"
supabase = create_client(url, key)

@app.route('/')
def index():
    return "Welcome to the Flask API!"

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']

    response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })

    return jsonify(response), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

    if response.error:
        return jsonify({"error": response.error.message}), 401

    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


