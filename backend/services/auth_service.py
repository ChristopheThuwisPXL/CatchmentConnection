from gotrue.errors import AuthApiError, AuthWeakPasswordError
from repository.supabase_client import supabase

from gotrue.errors import AuthApiError, AuthWeakPasswordError
from httpx import HTTPStatusError
from repository.supabase_client import supabase  # wherever you initialize it

def signup_user(email, password):
    if not email or not password:
        return {"error": "Email and password are required"}

    try:
        response = supabase.auth.sign_up({"email": email, "password": password})
        return {"message": "Signup successful. Check your email."}

    except AuthWeakPasswordError as e:
        return {"error": "Password must be at least 6 characters."}

    except HTTPStatusError as e:
        # Handle bad responses from Supabase
        if e.response.status_code == 422:
            return {"error": "Invalid input. Possibly a weak password or bad email format."}
        return {"error": f"HTTP error: {e.response.status_code} - {e.response.text}"}

    except AuthApiError as e:
        return {"error": str(e)}

    except Exception as e:
        return {"error": "Unexpected error: " + str(e)}



def login_user(email, password):
    try:
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return response
    except Exception as e:
        raise Exception("Login error: " + str(e))
