import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import os
import pickle

script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.dirname(script_dir)
data_path = os.path.join(models_dir, "processed_data.csv")

df = pd.read_csv(data_path)
df['Date'] = pd.to_datetime(df['Date']).dt.tz_localize(None)
df.sort_values('Date', inplace=True)

best_params = {
    'pH': {'changepoint_prior_scale': 0.1, 'seasonality_prior_scale': 0.01, 'seasonality_mode': 'additive'},
    'Temperature': {'changepoint_prior_scale': 0.1, 'seasonality_prior_scale': 1.0, 'seasonality_mode': 'additive'},
    'TDS': {'changepoint_prior_scale': 0.1, 'seasonality_prior_scale': 1.0, 'seasonality_mode': 'additive'}
}

def train_predict_save(df, target_col, params):
    ts = df[['Date', target_col]].rename(columns={'Date': 'ds', target_col: 'y'})
    
    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=False,
        changepoint_prior_scale=params['changepoint_prior_scale'],
        seasonality_prior_scale=params['seasonality_prior_scale'],
        seasonality_mode=params['seasonality_mode']
    )
    
    model.fit(ts)
    
    # Predict on full historical data & 30 days ahead
    future = model.make_future_dataframe(periods=2160, freq='20min')
    forecast = model.predict(future)
    
    model_path = os.path.join(script_dir, f"{target_col.lower()}_prediction_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f"✅ Saved model for {target_col} at {model_path}")
    
    # Plot actual vs predicted
    plt.figure(figsize=(14,6))
    plt.plot(ts['ds'], ts['y'], label='Actual', alpha=0.7)
    plt.plot(forecast['ds'], forecast['yhat'], label='Predicted', alpha=0.7)
    plt.xlabel('Date')
    plt.ylabel(target_col)
    plt.title(f'{target_col} Actual vs In-Sample Predicted')
    plt.legend()
    plt.tight_layout()
    plt.show()
    
    return model, forecast

models = {}
forecasts = {}

for target in ['pH', 'Temperature', 'TDS']:
    print(f"\n🔮 Training, predicting and saving model for {target} ...")
    model, forecast = train_predict_save(df, target, best_params[target])
    models[target] = model
    forecasts[target] = forecast
