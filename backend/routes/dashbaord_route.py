from flask import Blueprint, jsonify
from services.dashboard_service import fetch_latest_sensor_data

def register_sensor_routes(app):
    sensor_bp = Blueprint("sensor", __name__)

    @sensor_bp.route("/getSensorData", methods=["GET"])
    def get_sensor_data():
        try:
            sensor_data = fetch_latest_sensor_data()
            if sensor_data:
                return jsonify([sensor_data]), 200
            else:
                return jsonify([]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    app.register_blueprint(sensor_bp)
