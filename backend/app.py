from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.auth_routes import register_auth_routes
from routes.history_routes import register_history_routes
from routes.CRUD_routes import account_routes
from config import Config
from repository.supabase_client import supabase

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
app.debug = True
register_auth_routes(app)
register_history_routes(app)
account_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    
