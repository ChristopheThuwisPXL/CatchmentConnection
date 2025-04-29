from repository.supabase_client import supabase

def signup_user(email, password):
    if not email or not password:
        return {"error": "Email and password are required"}

    try:
        response = supabase.auth.sign_up({"email": email, "password": password})
        if response.user:
            supabase.table("Profiles").insert({
                "id": response.user.id,
                "email": response.user.email,
                "name": None,
                "avatar_url": None
            }).execute()

        return {"message": "Signup successful. Check your email."}

    except Exception as e:
        return {"error": "Unexpected error: " + str(e)}



def login_user(email, password):
    try:
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return response
    except Exception as e:
        raise Exception("Login error: " + str(e))
