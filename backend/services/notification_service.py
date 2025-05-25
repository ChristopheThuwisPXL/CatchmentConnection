import time
from datetime import datetime
from repository.supabase_client import supabase


thresholds = {
    "TDS": {"min": 100, "max": 400},
    "Temp": {"min": 10, "max": 30},
    "pH": {"min": 6.0, "max": 8.5},
}

def insert_notification_if_not_exists(message, sensor_name, value, now):
    existing = supabase.table("Notifications") \
        .select("*") \
        .eq("Message", message) \
        .eq("Sensor", sensor_name) \
        .eq("Value", value) \
        .limit(1) \
        .execute()

    if not existing.data:
        supabase.table("Notifications").insert({
            "Date": now,
            "Message": message,
            "Sensor": sensor_name,
            "Value": value,
            "read":False
        }).execute()

def monitor_sensors():
    while True:
        try:
            print("Checking latest sensor data...")
            response = supabase.table("Sensordata").select("*").order("id", desc=True).limit(1).execute()

            if response.data:
                sensor = response.data[0]
                sensor_id = sensor["id"]
                pH = sensor.get("pH")
                TDS = sensor.get("TDS")
                temp = sensor.get("Temperature")
                now = datetime.now().isoformat()

                if TDS is not None:
                    if TDS < thresholds["TDS"]["min"]:
                        message = f"Sensor {sensor_id} - TDS level too LOW"
                    elif TDS > thresholds["TDS"]["max"]:
                        message = f"Sensor {sensor_id} - TDS level too HIGH"
                    else:
                        message = None
                    if message:
                        insert_notification_if_not_exists(message, "TDS", TDS, now)

                if temp is not None:
                    if temp < thresholds["Temp"]["min"]:
                        message = f"Sensor {sensor_id} - Temperature too LOW"
                    elif temp > thresholds["Temp"]["max"]:
                        message = f"Sensor {sensor_id} - Temperature too HIGH"
                    else:
                        message = None
                    if message:
                        insert_notification_if_not_exists(message, "Temperature", temp, now)

                if pH is not None:
                    if pH < thresholds["pH"]["min"]:
                        message = f"Sensor {sensor_id} - pH level too LOW"
                    elif pH > thresholds["pH"]["max"]:
                        message = f"Sensor {sensor_id} - pH level too HIGH"
                    else:
                        message = None
                    if message:
                        insert_notification_if_not_exists(message, "pH", pH, now)

            print("check complete")
        except Exception as e:
            print(f"Error checking sensor data: {e}")

        time.sleep(1200)  # 20 minutes
