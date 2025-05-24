import pickle
import os
import pandas as pd
from datetime import datetime
import joblib
from dateutil import parser
from repository.supabase_client import supabase

script_dir = os.path.dirname(os.path.abspath(__file__))
anomaly_model_path = os.path.join(script_dir, "..", "models", "anomaly_model", "anomaly_model.pkl")
severity_model_path = os.path.join(script_dir, "..", "models", "severity_model", "severity_model.pkl")

class ModelService:
    def __init__(self):
        base_path = os.path.dirname(os.path.abspath(__file__))
        models_folder = os.path.join(base_path, '..', 'models', 'prediction_model')
        self.models = {
            'ph': self.load_model(models_folder, 'ph'),
            'tds': self.load_model(models_folder, 'tds'),
            'temperature': self.load_model(models_folder, 'temperature')
        }

    def load_model(self, base_path, target_col):
        model_path = os.path.join(base_path, f"{target_col.lower()}_prediction_model.pkl")
        with open(model_path, 'rb') as f:
            return pickle.load(f)

    def load_sensor_data(self):
        all_rows = []
        offset = 0
        batch_size = 1000

        while True:
            resp = (
                supabase
                .table("Sensordata")
                .select("*")
                .order("Date")
                .range(offset, offset + batch_size - 1)
                .execute()
            )
            rows = resp.data or []
            all_rows.extend(rows)

            if len(rows) < batch_size:
                break

            offset += batch_size

        df = pd.DataFrame(all_rows)
        df['Date'] = pd.to_datetime(df['Date'], utc=True)
        return df

    def predict_all_models(self):
        future_dates = pd.date_range(
            start=datetime.utcnow(), periods=30 * 24 * 3, freq="20min"
        )

        df = pd.DataFrame({"ds": future_dates})
        results = {"ds": df["ds"].dt.strftime("%Y-%m-%dT%H:%M:%S").tolist()}

        for param in ["ph", "tds", "temperature"]:
            model = self.models[param]
            pred = model.predict(df[["ds"]])
            key = param.upper() if param == "ph" else param.capitalize()
            results[key] = pred["yhat"].round(2).tolist()

        output = []
        for i in range(len(df)):
            output.append({
                "ds": results["ds"][i],
                "pH": results["PH"][i],
                "TDS": results["Tds"][i],
                "Temperature": results["Temperature"][i],
                "EC": None
            })

        return output

    def get_monthly_anomalies(self):
        df = self.load_sensor_data()
        model = joblib.load(anomaly_model_path)
        X = df[['pH', 'Temperature', 'TDS']]
        df['anomaly'] = model.predict(X) == -1
        df['Date'] = df['Date'].dt.tz_localize(None)
        df['month'] = df['Date'].dt.to_period("M").astype(str)

        summary = df[df['anomaly']].groupby('month').size().reset_index(name='anomaly_count')
        return summary.to_dict(orient='records')

    def get_monthly_severities(self):
        df = self.load_sensor_data()
        model = joblib.load(severity_model_path)
        X = df[['pH', 'Temperature', 'TDS']]
        df['Severity'] = model.predict(X)
        df['Date'] = df['Date'].dt.tz_localize(None)
        df['month'] = df['Date'].dt.to_period("M").astype(str)

        summary = df.groupby(['month', 'Severity']).size().reset_index(name='count')

        grouped = {}
        for row in summary.to_dict(orient='records'):
            m = row['month']
            if m not in grouped:
                grouped[m] = {'month': m}
            grouped[m][row['Severity']] = row['count']

        return list(grouped.values())
    
    def get_predicted_anomalies_by_month(self):
        future_data = self.predict_all_models()
        df = pd.DataFrame(future_data)
        df['ds'] = pd.to_datetime(df['ds'], utc=True)
        df['ds'] = df['ds'].dt.tz_localize(None)

        model = joblib.load(anomaly_model_path)
        X = df[['pH', 'Temperature', 'TDS']]
        df['anomaly'] = model.predict(X) == -1
        df['month'] = df['ds'].dt.to_period("M").astype(str)

        monthly = df[df['anomaly']].groupby('month').size().reset_index(name='anomaly_count')
        return monthly.to_dict(orient='records')

    def get_predicted_severities_by_month(self):
        future_data = self.predict_all_models()
        df = pd.DataFrame(future_data)
        df['ds'] = pd.to_datetime(df['ds'], utc=True)
        df['ds'] = df['ds'].dt.tz_localize(None)

        model = joblib.load(severity_model_path)
        X = df[['pH', 'Temperature', 'TDS']]
        df['Severity'] = model.predict(X)
        df['month'] = df['ds'].dt.to_period("M").astype(str)

        summary = df.groupby(['month', 'Severity']).size().reset_index(name='count')

        result = {}
        for row in summary.to_dict(orient='records'):
            month = row['month']
            if month not in result:
                result[month] = {'month': month}
            result[month][row['Severity']] = row['count']

        return list(result.values())

