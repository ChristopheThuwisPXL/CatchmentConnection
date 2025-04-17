from flask import request, jsonify
from services.history_service import getMainData

def register_history_routes(app):
    @app.route('/history', methods=['GET'])
    def getHistory():
        year = request.args.get('year')
        data = getMainData(year)
        return jsonify(data), 200   