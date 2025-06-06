import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import os
import pickle
import numpy as np

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

optimal_lags = {
    'pH': [216],
    'TDS': [216],
    'Temperature': [72]
}

def train_predict_save(df, target_col, params, lags):
    df['hour'] = df['Date'].dt.hour
    df['dayofweek'] = df['Date'].dt.dayofweek
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['dow_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7)

    for lag in lags:
        df[f'{target_col}_lag_{lag}'] = df[target_col].shift(lag)

    df.dropna(inplace=True)

    cols = ['Date', target_col, 'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos'] + [f'{target_col}_lag_{lag}' for lag in lags]
    ts = df[cols].rename(columns={'Date': 'ds', target_col: 'y'})

    model = Prophet(
        daily_seasonality=False,
        weekly_seasonality=False,
        yearly_seasonality=False,
        changepoint_prior_scale=params['changepoint_prior_scale'],
        seasonality_prior_scale=params['seasonality_prior_scale'],
        seasonality_mode=params['seasonality_mode']
    )
    model.add_seasonality(name='daily_custom', period=1, fourier_order=10)
    model.add_seasonality(name='weekly_custom', period=7, fourier_order=5)

    model.add_regressor('hour_sin')
    model.add_regressor('hour_cos')
    model.add_regressor('dow_sin')
    model.add_regressor('dow_cos')
    for lag in lags:
        model.add_regressor(f'{target_col}_lag_{lag}')

    model.fit(ts)

    future = model.make_future_dataframe(periods=2160, freq='20min')
    future['hour'] = future['ds'].dt.hour
    future['dayofweek'] = future['ds'].dt.dayofweek
    future['hour_sin'] = np.sin(2 * np.pi * future['hour'] / 24)
    future['hour_cos'] = np.cos(2 * np.pi * future['hour'] / 24)
    future['dow_sin'] = np.sin(2 * np.pi * future['dayofweek'] / 7)
    future['dow_cos'] = np.cos(2 * np.pi * future['dayofweek'] / 7)

    last_known = df.iloc[-1]
    for lag in lags:
        future[f'{target_col}_lag_{lag}'] = last_known[f'{target_col}_lag_{lag}']

    forecast = model.predict(future)

    model_path = os.path.join(script_dir, f"{target_col.lower()}_prediction_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    print(f" Saved model for {target_col} at {model_path}")

    plt.figure(figsize=(14, 6))
    plt.plot(ts['ds'], ts['y'], label='Actual', alpha=0.7)
    plt.plot(forecast['ds'], forecast['yhat'], label='Predicted', alpha=0.7)
    plt.xlabel('Date')
    plt.ylabel(target_col)
    plt.title(f'{target_col} Forecast with Time + Lag Features ({", ".join([str(l) for l in lags])})')
    plt.legend()
    plt.tight_layout()
    plt.show()

    return model, forecast

models = {}
forecasts = {}

for target in ['pH', 'Temperature', 'TDS']:
    print(f"\n Training model for {target} with lags {optimal_lags[target]} ...")
    model, forecast = train_predict_save(df.copy(), target, best_params[target], optimal_lags[target])
    models[target] = model
    forecasts[target] = forecast
