import os
import pickle
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
from repository.supabase_client import supabase

LAG_SETTINGS = {
    'pH': [216],
    'TDS': [216],
    'Temperature': [72],
}

class ModelService:
    def __init__(self):
        self.lag_settings = LAG_SETTINGS
        base_path = os.path.dirname(os.path.abspath(__file__))
        models_folder = os.path.join(base_path, '..', 'models', 'prediction_model')

        self.models = {
            'pH': self.load_model(models_folder, 'pH'),
            'TDS': self.load_model(models_folder, 'TDS'),
            'Temperature': self.load_model(models_folder, 'Temperature')
        }

        anomaly_model_path = os.path.join(base_path, "..", "models", "anomaly_model", "anomaly_model.pkl")
        severity_model_path = os.path.join(base_path, "..", "models", "severity_model", "severity_model.pkl")
        self.anomaly_model = joblib.load(anomaly_model_path)
        self.severity_model = joblib.load(severity_model_path)

        self.training_data = self.prepare_training_data()

    def load_model(self, folder, name):
        with open(os.path.join(folder, f"{name.lower()}_prediction_model.pkl"), 'rb') as f:
            return pickle.load(f)

    def load_sensor_data(self):
        all_rows, offset, batch_size = [], 0, 1000

        while True:
            resp = supabase.table("Sensordata").select("*").order("Date").range(offset, offset + batch_size - 1).execute()
            rows = resp.data or []
            all_rows.extend(rows)
            if len(rows) < batch_size:
                break
            offset += batch_size

        df = pd.DataFrame(all_rows)
        df['Date'] = pd.to_datetime(df['Date'], utc=True)
        return df

    def prepare_training_data(self):
        df = self.load_sensor_data()
        df = df.sort_values('Date').copy()
        df['hour'] = df['Date'].dt.hour
        df['dayofweek'] = df['Date'].dt.dayofweek
        df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
        df['dow_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7)
        df['dow_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7)

        for param, lags in self.lag_settings.items():
            for lag in lags:
                df[f'{param}_lag_{lag}'] = df[param].shift(lag)

        df.dropna(inplace=True)
        return df

    def predict_all_models(self):
        future_dates = pd.date_range(start=datetime.utcnow(), periods=30 * 24 * 3, freq="20min")
        df = pd.DataFrame({"ds": future_dates})
        results = {"ds": df["ds"].dt.strftime("%Y-%m-%dT%H:%M:%S").tolist()}

        df["hour"] = df["ds"].dt.hour
        df["dayofweek"] = df["ds"].dt.dayofweek
        df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
        df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
        df["dow_sin"] = np.sin(2 * np.pi * df["dayofweek"] / 7)
        df["dow_cos"] = np.cos(2 * np.pi * df["dayofweek"] / 7)

        last_known = self.training_data.iloc[-1]

        for param in self.lag_settings:
            model = self.models[param]
            lags = self.lag_settings[param]

            for lag in lags:
                df[f'{param}_lag_{lag}'] = last_known[f'{param}_lag_{lag}']

            predictors = ['ds', 'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos'] + [f'{param}_lag_{lag}' for lag in lags]
            forecast = model.predict(df[predictors])
            results[param] = forecast['yhat'].round(2).tolist()

        output = []
        for i in range(len(df)):
            output.append({
                "ds": results["ds"][i],
                "pH": results["pH"][i],
                "TDS": results["TDS"][i],
                "Temperature": results["Temperature"][i],
                "EC": None
            })

        return output

    def get_monthly_anomalies(self):
        df = self.load_sensor_data()
        X = df[['pH', 'Temperature', 'TDS']]
        df['anomaly'] = self.anomaly_model.predict(X) == -1
        df['month'] = df['Date'].dt.tz_localize(None).dt.to_period("M").astype(str)
        return df[df['anomaly']].groupby('month').size().reset_index(name='anomaly_count').to_dict(orient='records')

    def get_monthly_severities(self):
        df = self.load_sensor_data()
        X = df[['pH', 'Temperature', 'TDS']]
        df['Severity'] = self.severity_model.predict(X)
        df['month'] = df['Date'].dt.tz_localize(None).dt.to_period("M").astype(str)
        summary = df.groupby(['month', 'Severity']).size().reset_index(name='count')

        grouped = {}
        for row in summary.to_dict(orient='records'):
            m = row['month']
            if m not in grouped:
                grouped[m] = {'month': m}
            grouped[m][row['Severity']] = row['count']
        return list(grouped.values())

    def get_predicted_anomalies_by_month(self):
        df = pd.DataFrame(self.predict_all_models())
        df['ds'] = pd.to_datetime(df['ds'])
        X = df[['pH', 'Temperature', 'TDS']]
        df['anomaly'] = self.anomaly_model.predict(X) == -1
        df['month'] = df['ds'].dt.tz_localize(None).dt.to_period("M").astype(str)
        return df[df['anomaly']].groupby('month').size().reset_index(name='anomaly_count').to_dict(orient='records')

    def get_predicted_severities_by_month(self):
        df = pd.DataFrame(self.predict_all_models())
        df['ds'] = pd.to_datetime(df['ds'])
        X = df[['pH', 'Temperature', 'TDS']]
        df['Severity'] = self.severity_model.predict(X)
        df['month'] = df['ds'].dt.tz_localize(None).dt.to_period("M").astype(str)
        summary = df.groupby(['month', 'Severity']).size().reset_index(name='count')

        grouped = {}
        for row in summary.to_dict(orient='records'):
            m = row['month']
            if m not in grouped:
                grouped[m] = {'month': m}
            grouped[m][row['Severity']] = row['count']
        return list(grouped.values())
