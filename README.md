# International Research Project 2025 - Catchment Connection


# Getting started

Have Docker Desktop installed, then run the following command:

    docker compose up

To remove the containers, run the following command:

    docker compose down

The app will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

# About the project

Catchment Connection is a full-stack web platform for real-time and historical water quality monitoring. It uses IoT sensors and AI models to detect trends, predict conditions, classify severity, and visualize environmental health across catchment areas. The platform includes live dashboards, historical data visualizations, predictive analytics, user account management, and automatic alerts.

### Welcome
- Welcome page with login/register functionality
- Overview of the Hartebeespoort Dam
- Info on Catchment Areas
- Struggles with the Hartebeespoort Dam
- Pollution issues
- Water Hyacinth details

![image](https://github.com/user-attachments/assets/089d07df-1ea1-4b68-87e2-011c4bd2ada0)

### Dashboard
- Real-Time Sensor Values: pH, TDS, Temperature and EC from connected devices.
- 72-Hour Chart: View sensor trends over the last 3 days.
- AI Forecast Models: Using Prophet, predict 30-day trends for pH, TDS, and Temperature.
- Severity Classification: AI-based severity levels visualized in a bar chart.
- Anomaly Detection: Isolation Forest model detects outliers in a line chart.
- Interactive Map: Leaflet map showing current GPS position of the sensors.

![image](https://github.com/user-attachments/assets/062b9c1a-7b22-4bed-9394-ba6ccaf3689e)

### History
- Explore long-term water quality data going back to the year 2000:
- Visualizes historical readings for pH, TDS, Temperature, and EC.
- Year-on-year comparisons to show trend direction (up/down).
- Filter data by state, year, and month for detailed analysis.

![image](https://github.com/user-attachments/assets/f299788a-5c29-4b1e-b05c-a9a281a1726b)

### Team
- Meet the contributors to Catchment Connection:
- Team member profiles with roles.
- Direct links to GitHub and LinkedIn.

![image](https://github.com/user-attachments/assets/47b11fe7-289a-4072-b5a9-bc13603e30c3)

### Account
- Manage your user profile securely:
- Register and login/logout.
- Update your email, name, and password.
- Upload a custom avatar.
- Permanently delete your account.

![image](https://github.com/user-attachments/assets/db979c7d-013d-47a2-b645-c59c33fc58b3)


### Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind, Recharts, Leaflet
- Backend: Python, Flask
- Database: Supabase (PostgreSQL)
- Machine Learning: Prophet (forecasting), Scikit-learn (classification, anomaly detection)
- Docker: Full containerized setup with docker-compose

# Made by

### Trent Evans - Belgium Campus

### Calvin Nijenhuis - Belgium Campus

### Christophe Thuwis - PXL University College
