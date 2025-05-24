from flask import Flask
from flask_cors import CORS
from routes.auth_routes import register_auth_routes
from routes.history_routes import register_history_routes
from routes.user_routes import register_user_routes
from routes.dashboard_route import register_sensor_routes
from services.model_service import ModelService
from routes.model_routes import register_model_routes
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
app.debug = True

register_auth_routes(app)
register_history_routes(app)
register_user_routes(app)
register_sensor_routes(app)
model_service = ModelService()
register_model_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
