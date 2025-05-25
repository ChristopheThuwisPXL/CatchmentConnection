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

    @app.route('/notifications/read', methods=['POST'])
    def mark_notification_read():
        data = request.get_json()
        notif_id = data.get("id")
        if not notif_id:
            return jsonify({"error": "No id provided"}), 400

        try:
            supabase.table("Notifications").update({"read": True}).eq("id", notif_id).execute()
            return jsonify({"message": f"Notification {notif_id} marked as read"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
