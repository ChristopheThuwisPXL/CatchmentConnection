from flask import request, jsonify
from repository.supabase_client import supabase
import os

def getNotis(app):
    @app.route('/noti', methods=['GET'])
    def get_sensor_data():
        try:
            response = supabase.table("Notifications").select("*").execute()
            return jsonify(response.data), 200

        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500


