from flask import Flask
from flask_cors import CORS
from routes.auth_routes import register_auth_routes
from routes.history_routes import register_history_routes
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

register_auth_routes(app)
register_history_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
