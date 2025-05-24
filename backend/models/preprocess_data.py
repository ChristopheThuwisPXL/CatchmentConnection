import pandas as pd
import os
from sklearn.linear_model import LinearRegression

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, "Sensordata.csv")

df = pd.read_csv(file_path)

df = df.drop(columns=[col for col in ['latitude', 'longitude'] if col in df.columns])

known_df = df[df['TDS'] > 0].copy()
missing_df = df[df['TDS'] == 0].copy()

if not known_df.empty and len(known_df) >= 10:
    X_train = known_df[['pH', 'Temperature']]
    y_train = known_df['TDS']
    model = LinearRegression()
    model.fit(X_train, y_train)

    if not missing_df.empty:
        X_missing = missing_df[['pH', 'Temperature']]
        tds_predicted = model.predict(X_missing)
        df.loc[df['TDS'] == 0, 'TDS'] = [round(val, 2) for val in tds_predicted]

df['EC'] = df['TDS'].apply(lambda x: round(x / 0.67, 2))

output_path = os.path.join(script_dir, "processed_data.csv")
df.to_csv(output_path, index=False)
print(f"\u2705 Processed data saved to: {output_path}")
