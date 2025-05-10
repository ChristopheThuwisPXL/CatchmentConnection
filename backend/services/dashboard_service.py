from repository.supabase_client import supabase
from datetime import datetime, timedelta, timezone
from dateutil import parser

def fetch_latest_sensor_data():
    try:
        response = (
            supabase
            .table("Sensordata")
            .select("*")  # Include longitude and latitude in the query
            .order("Date", desc=True)
            .limit(1)
            .execute()
        )

        if not response.data:
            return None

        latest = response.data[0]
        date_str = latest['Date']
        date_obj = parser.isoparse(date_str)

        # Ensure UTC timezone awareness on both sides
        now = datetime.now(timezone.utc)
        is_offline = now - date_obj > timedelta(minutes=15)

        # Fetch the longitude and latitude values
        longitude = latest.get("longitude")  # Assuming the column name is "longitude"
        latitude = latest.get("latitude")    # Assuming the column name is "latitude"

        return {
            "id": latest["id"],
            "date": date_obj.isoformat(),
            "pH": latest.get("pH"),
            "TDS": latest.get("TDS"),
            "Temperature": latest.get("Temperature"),
            "status": "Offline" if is_offline else "Online",
            "location": {
                "longitude": longitude,
                "latitude": latitude
            }
        }

    except Exception as e:
        raise RuntimeError(f"Error fetching data from Supabase: {e}")
