import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns

script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.dirname(script_dir)
file_path = os.path.join(models_dir, "processed_data_with_severity.csv")

df = pd.read_csv(file_path)

# Plot TDS vs Temperature, colored by Severity
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df, x="Temperature", y="TDS", hue="Severity", palette="Set1", alpha=0.8, edgecolor="w")
plt.title("TDS vs Temperature by Severity Cluster")
plt.xlabel("Temperature (°C)")
plt.ylabel("TDS (ppm)")
plt.grid(True)
plt.legend(title="Severity")
plt.tight_layout()
plt.show()

# Plot pairwise relationships
sns.pairplot(df, vars=["pH", "Temperature", "TDS"], hue="Severity", palette="Set1", plot_kws={'alpha': 0.6})
plt.suptitle("Pairwise Feature Relationships Colored by Severity", y=1.02)
plt.tight_layout()
plt.show()
