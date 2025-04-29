from flask import request, jsonify
from services.user_service import (
    get_user_info,
    update_user_metadata,
    delete_user_account,
    change_user_password,
    upload_user_avatar
)

def register_user_routes(app):
    @app.route('/user', methods=['GET'])
    def get_user():
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Missing token'}), 401
        return get_user_info(token)

    @app.route('/user', methods=['PUT'])
    def update_user():
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        data = request.get_json()
        if not token:
            return jsonify({'error': 'Missing token'}), 401
        return update_user_metadata(token, data)

    @app.route('/user', methods=['DELETE'])
    def delete_user():
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Missing token'}), 401
        return delete_user_account(token)

    @app.route('/user/password', methods=['POST'])
    def change_password():
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        data = request.get_json()
        new_password = data.get('new_password')
        if not token or not new_password:
            return jsonify({'error': 'Missing token or password'}), 400
        return change_user_password(token, new_password)
    
    @app.route('/user/avatar', methods=['POST'])
    def upload_avatar():
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({"error": "Missing token"}), 401

        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        return upload_user_avatar(token, file)
