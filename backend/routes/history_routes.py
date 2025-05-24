from flask import request, jsonify
from services.dashboard_service import fetch_combined_history
from services.history_service import getMainData

def register_history_routes(app):
    @app.route('/history', methods=['GET'])
    def get_history():
        year = request.args.get('year')
        data = getMainData(year)
        return jsonify(data), 200

    @app.route('/history/combined', methods=['GET'])
    def get_combined_history():
        try:
            data = fetch_combined_history()
            return jsonify(data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
