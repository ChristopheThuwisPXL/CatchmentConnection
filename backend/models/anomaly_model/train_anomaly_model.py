import pandas as pd
import os
import joblib
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.ensemble import IsolationForest

script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.dirname(script_dir)
data_path = os.path.join(models_dir, "processed_data.csv")
df = pd.read_csv(data_path)

X = df[['pH', 'Temperature', 'TDS']]

iso_model = IsolationForest(
    n_estimators=100,
    contamination=0.01,
    random_state=42
)
iso_model.fit(X)

df['anomaly_score'] = iso_model.decision_function(X) 
df['anomaly_label'] = iso_model.predict(X)
df['is_anomaly'] = df['anomaly_label'] == -1

model_path = os.path.join(script_dir, "anomaly_model.pkl")
joblib.dump(iso_model, model_path)
print(f"✅ Anomaly detection model saved to: {model_path}")

plt.figure(figsize=(10, 5))
plt.hist(df['anomaly_score'], bins=50, color="skyblue", edgecolor="black")
threshold = np.percentile(df['anomaly_score'], 1)
plt.axvline(threshold, color="red", linestyle="--", label="1% threshold")
plt.title("Isolation Forest Anomaly Scores")
plt.xlabel("Anomaly Score (higher = normal)")
plt.ylabel("Frequency")
plt.legend()
plt.tight_layout()
plt.show()

plt.figure(figsize=(10, 6))
sns.boxplot(data=df[df['is_anomaly']][['pH', 'Temperature', 'TDS']])
plt.title("Distribution of Anomalous Values by Feature")
plt.tight_layout()
plt.show()


