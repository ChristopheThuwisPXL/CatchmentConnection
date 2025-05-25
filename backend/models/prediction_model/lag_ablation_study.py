import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import os
import pickle
import numpy as np
from sklearn.metrics import mean_absolute_error, r2_score

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

def train_and_evaluate(df, target_col, params, lags=[]):
    df['hour'] = df['Date'].dt.hour
    df['dayofweek'] = df['Date'].dt.dayofweek
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['dow_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7)

    for lag in lags:
        df[f'{target_col}_lag_{lag}'] = df[target_col].shift(lag)

    df.dropna(inplace=True)

    cutoff = int(len(df) * 0.8)
    train = df.iloc[:cutoff]
    test = df.iloc[cutoff:]

    cols = ['Date', target_col, 'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos'] + [f'{target_col}_lag_{lag}' for lag in lags]
    ts_train = train[cols].rename(columns={'Date': 'ds', target_col: 'y'})
    ts_test = test[cols].rename(columns={'Date': 'ds', target_col: 'y'})

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

    model.fit(ts_train)
    forecast = model.predict(ts_test)

    mae = mean_absolute_error(ts_test['y'], forecast['yhat'])
    r2 = r2_score(ts_test['y'], forecast['yhat'])

    smoothed_actual = ts_test['y'].rolling(window=9, center=True).mean()
    smoothed_pred = forecast['yhat'].rolling(window=9, center=True).mean()
    smoothed_mae = mean_absolute_error(smoothed_actual.dropna(), smoothed_pred.dropna())

    return mae, smoothed_mae, r2

lag_sets = {
    "baseline": [],
    "lag_72": [72],
    "lag_216": [216],
    "lag_504": [504], 
    "combo_72_504": [72, 504],
    "combo_216_504": [216, 504],
    "combo_all_long": [72, 216, 504]
}
all_results = {}

for target in ["pH", "TDS", "Temperature"]:
    print(f"\n Lag Ablation Study on {target}")
    results = {}

    for name, lags in lag_sets.items():
        mae, smoothed_mae, r2 = train_and_evaluate(df.copy(), target_col=target, params=best_params[target], lags=lags)
        results[name] = {"mae": mae, "smoothed_mae": smoothed_mae, "r2": r2}
        print(f"{name:<15} | MAE = {mae:.4f} | Smoothed MAE = {smoothed_mae:.4f} | R² = {r2:.4f}")

    all_results[target] = results

print("\n Summary of Best Lag Combinations per Metric:")
for metric in ['mae', 'smoothed_mae', 'r2']:
    print(f"\n Best by {metric.upper()}:")
    for target in all_results:
        best = min(all_results[target].items(), key=lambda x: x[1][metric]) if metric != 'r2' \
               else max(all_results[target].items(), key=lambda x: x[1][metric])
        print(f"{target:<12} → {best[0]:<15} ({metric} = {best[1][metric]:.4f})")
