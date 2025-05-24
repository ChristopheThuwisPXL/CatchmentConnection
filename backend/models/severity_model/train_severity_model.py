import pandas as pd
import os
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.dirname(script_dir)
file_path = os.path.join(models_dir, "processed_data.csv")

df = pd.read_csv(file_path)

features = df[['pH', 'Temperature', 'TDS']]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(features)

kmeans = KMeans(n_clusters=4, random_state=42)
df['SeverityCluster'] = kmeans.fit_predict(X_scaled)

severity_map = {
    0: 'Low',
    1: 'Critical',
    2: 'Moderate',
    3: 'High'
}
df['Severity'] = df['SeverityCluster'].map(severity_map)

X = df[['pH', 'Temperature', 'TDS']]
y = df['Severity']

X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.3, random_state=42)

clf = RandomForestClassifier(
    n_estimators=200,
    max_depth=4,
    min_samples_leaf=3,
    class_weight='balanced',
    random_state=42
)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

print(classification_report(y_test, y_pred))

model_path = os.path.join(script_dir, "severity_model.pkl")
joblib.dump(clf, model_path)
print(f"\u2705 Model saved to: {model_path}")
