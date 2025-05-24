from flask import jsonify
from services.model_service import ModelService

model_service = ModelService()

def register_model_routes(app):
    @app.route("/predict", methods=["GET"])
    def predict_combined():
        return jsonify(model_service.predict_all_models()), 200

    @app.route("/predict/anomalies", methods=["GET"])
    def get_anomalies():
        return jsonify(model_service.get_monthly_anomalies()), 200

    @app.route("/predict/severities", methods=["GET"])
    def get_severities():
        return jsonify(model_service.get_monthly_severities()), 200
    
    @app.route("/predict/anomalies/future", methods=["GET"])
    def get_predicted_anomalies():
        return jsonify(model_service.get_predicted_anomalies_by_month()), 200

    @app.route("/predict/severities/future", methods=["GET"])
    def get_predicted_severities():
        return jsonify(model_service.get_predicted_severities_by_month()), 200

