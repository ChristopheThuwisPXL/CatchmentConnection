from repository.supabase_client import supabase
from flask import jsonify
import requests
import uuid
import mimetypes
import traceback

SUPABASE_AUTH_URL = f"{supabase.supabase_url}/auth/v1"

def get_user_info(token):
    headers = {
        'Authorization': f'Bearer {token}',
        'apikey': supabase.supabase_key
    }

    res = requests.get(f"{SUPABASE_AUTH_URL}/user", headers=headers)
    if res.status_code != 200:
        return jsonify({'error': 'Invalid token or user not found'}), res.status_code

    user_data = res.json()
    user_id = user_data['id']
    profile_res = supabase.table("Profiles").select("*").eq("id", user_id).single().execute()

    if not profile_res.data:
        return jsonify({'error': 'Failed to fetch profile'}), 400

    profile = profile_res.data
    return jsonify({
        "id": user_id,
        "email": user_data.get("email", ""),
        "name": profile.get("name", "") if profile else "",
        "avatar": profile.get("avatar_url", "") if profile else ""
    }), 200


def update_user_metadata(token, metadata):
    headers = {
        'Authorization': f'Bearer {token}',
        'apikey': supabase.supabase_key
    }
    res = requests.get(f"{SUPABASE_AUTH_URL}/user", headers=headers)
    if res.status_code != 200:
        return jsonify({'error': 'Invalid token'}), res.status_code
    user_data = res.json()
    user_id = user_data['id']
    update_data = {}
    if "name" in metadata:
        update_data["name"] = metadata["name"]
    if "email" in metadata:
        update_data["email"] = metadata["email"]

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    update_res = supabase.table("Profiles").update(update_data).eq("id", user_id).execute()

    if not update_res.data:
        return jsonify({'error': 'Failed to update profile'}), 400

    return jsonify({'message': 'Profile updated successfully'}), 200


def delete_user_account(token):
    # Supabase Admin API needed for real delete; workaround: disable user or revoke session
    # For now, we can invalidate the user's session
    headers = {
        'Authorization': f'Bearer {token}',
        'apikey': supabase.supabase_key
    }
    # Revoke all sessions (user logs out everywhere)
    res = requests.post(f"{SUPABASE_AUTH_URL}/logout", headers=headers)

    if res.status_code == 204:
        return jsonify({'message': 'Session revoked, account deactivated'}), 200
    return jsonify({'error': 'Failed to revoke session'}), res.status_code


def change_user_password(token, new_password):
    headers = {
        'Authorization': f'Bearer {token}',
        'apikey': supabase.supabase_key,
        'Content-Type': 'application/json'
    }
    payload = {
        'password': new_password
    }
    res = requests.put(f"{SUPABASE_AUTH_URL}/user", headers=headers, json=payload)

    if res.status_code == 200:
        return jsonify({'message': 'Password changed successfully'}), 200
    return jsonify({'error': 'Password update failed'}), res.status_code

def upload_user_avatar(token, file):
    try:
        file_extension = mimetypes.guess_extension(file.mimetype) or '.png'
        filename = f"{uuid.uuid4()}{file_extension}"
        filepath = f"{filename}"
        file_data = file.read()

        res = supabase.storage.from_("avatars").upload(
            path=filename,
            file=file_data,
            file_options={
                "content-type": file.mimetype,
                "x-upsert": "true"  # 🔥 YES, like this as a header!
            }
        )

        if not res:
            return jsonify({"error": "Failed to upload avatar to storage"}), 500
        public_url = supabase.storage.from_("avatars").get_public_url(filepath)

        headers = {
            "Authorization": f"Bearer {token}",
            "apikey": supabase.supabase_key,
            "Content-Type": "application/json"
        }

        SUPABASE_AUTH_URL = f"{supabase.supabase_url}/auth/v1/user"
        update_res = requests.put(SUPABASE_AUTH_URL, headers=headers, json={
            "data": {
                "avatar": public_url
            }
        })

        if update_res.status_code != 200:
            return jsonify({"error": "Failed to update user avatar metadata"}), update_res.status_code

        return jsonify({"avatar_url": public_url}), 200

    except Exception as e:
        print(f"Error uploading avatar: {str(e)}")
        traceback.print_exc()  # <-- print the full stack trace
        return jsonify({"error": str(e)}), 500
