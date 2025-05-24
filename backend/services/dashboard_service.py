from repository.supabase_client import supabase
from datetime import datetime, timedelta, timezone
from dateutil import parser

def fetch_latest_sensor_data():
    try:
        response = (
            supabase
            .table("Sensordata")
            .select("*")
            .order("Date", desc=True)
            .limit(1)
            .execute()
        )

        if not response.data:
            return None

        latest = response.data[0]
        date_str = latest["Date"]
        date_obj = parser.isoparse(date_str)

        if date_obj.tzinfo is None:
            date_obj = date_obj.replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)
        is_offline = now - date_obj > timedelta(minutes=21)

        print(f"[Sensor Status Check] Now: {now.isoformat()} | Sensor Time: {date_obj.isoformat()} | Offline: {is_offline}")

        return {
            "id": latest["id"],
            "Date": date_obj.isoformat(),
            "pH": latest.get("pH"),
            "TDS": latest.get("TDS"),
            "Temperature": latest.get("Temperature"),
            "EC": latest.get("EC"),
            "status": "Offline" if is_offline else "Online",
            "location": {
                "longitude": latest.get("longitude"),
                "latitude": latest.get("latitude"),
            }
        }

    except Exception as e:
        raise RuntimeError(f"Error fetching data from Supabase: {e}")


def fetch_sensor_history(hours: int):
    """
    Return every Sensordata row from the last `hours` hours,
    sorted oldest→newest, in the same shape as fetch_latest_sensor_data().
    """
    # cutoff timestamp in UTC ISO format
    now_utc   = datetime.now(timezone.utc)
    cutoff_iso = (now_utc - timedelta(hours=hours)).isoformat()

    # supabase for all rows with Date >= cutoff
    try:
        resp = (
            supabase
            .table("Sensordata")
            .select("*")
            .gte("Date", cutoff_iso)
            .order("Date", desc=False)      
            .execute()
        )
    except Exception as e:
        print("❌ Supabase history query failed:", e)
        raise
    data = resp.data or []

    # each row into the same dict shape that front-end 
    out = []
    for row in data:
        dt = parser.isoparse(row["Date"])
        out.append({
            "id":           row["id"],
            "Date":         dt.isoformat(),       # uppercase "Date"
            "pH":           row.get("pH"),
            "TDS":          row.get("TDS"),
            "Temperature":  row.get("Temperature"),
            "EC":           row.get("EC"),
            "status":       "Online",             # assume online for historical
            "location": {
                "longitude": row.get("longitude"),
                "latitude":  row.get("latitude"),
            }
        })
    return out

def fetch_combined_history(days: int = 30):
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=days)

    all_rows = []
    batch_size = 1000
    offset = 0

    while True:
        resp = (
            supabase
            .table("Sensordata")
            .select("*")
            .gte("Date", cutoff)
            .lte("Date", now)
            .order("Date", desc=False)
            .range(offset, offset + batch_size - 1)
            .execute()
        )

        data = resp.data or []
        all_rows.extend(data)

        if len(data) < batch_size:
            break
        offset += batch_size

    return [
        {
            "ds": parser.isoparse(row["Date"]).isoformat(),
            "pH": row.get("pH"),
            "TDS": row.get("TDS"),
            "Temperature": row.get("Temperature"),
            "EC": row.get("EC")
        }
        for row in all_rows
    ]


