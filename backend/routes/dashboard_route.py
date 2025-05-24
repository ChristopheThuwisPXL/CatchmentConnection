from flask import Blueprint, jsonify, request
from services.dashboard_service import fetch_latest_sensor_data, fetch_sensor_history

def register_sensor_routes(app):
    sensor_bp = Blueprint("sensor", __name__)

    @sensor_bp.route("/getSensorData", methods=["GET"])
    def get_sensor_data():
        try:
            # 1) See if client asked for last-N-hours
            hours = request.args.get("hours", type=int)
            if hours:
                history = fetch_sensor_history(hours)
                return jsonify(history), 200

            # 2) Otherwise just latest reading
            latest = fetch_latest_sensor_data()
            return jsonify([latest]) if latest else jsonify([]), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    app.register_blueprint(sensor_bp)
