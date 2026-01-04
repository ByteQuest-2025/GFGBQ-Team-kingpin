import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Settings: Generate 3 years of daily data
days = 1095  
start_date = datetime(2023, 1, 1)

data = []

for i in range(days):
    current_date = start_date + timedelta(days=i)
    
    # Extract numeric features from date
    day_of_year = current_date.timetuple().tm_yday
    month = current_date.month
    
    # --- REALISTIC WEATHER GENERATION (Using Math) ---
    
    # 1. Temperature: Uses a Sine wave to peak in Summer (approx Day 150)
    # Logic: Base temp 25 + fluctuation based on time of year
    temp_trend = 25 + 12 * np.sin((day_of_year - 105) * 2 * np.pi / 365)
    temp = np.random.normal(temp_trend, 3) # Add random daily noise
    
    # 2. Humidity: High in Monsoon (June-Sept), Low in Summer
    if 6 <= month <= 9: # Monsoon
        humidity = np.random.normal(85, 10)
        rainfall = np.random.exponential(40) # Heavy rain
    else:
        humidity = np.random.normal(40, 15)
        rainfall = np.random.exponential(2) if np.random.rand() > 0.8 else 0

    # 3. AQI (Air Quality): Worst in Winter (Nov-Jan)
    if month in [11, 12, 1]:
        aqi = np.random.normal(250, 60)
    else:
        aqi = np.random.normal(100, 40)

    # --- DISEASE LOGIC (Same as before, but driven by these new numbers) ---
    disease = "Normal"
    cases = np.random.randint(15, 30) # Base load
    
    # Triggers
    if rainfall > 50 and humidity > 80:
        disease = "Dengue"
        cases += np.random.randint(40, 90)
    elif temp < 15 and month in [12, 1, 2]: # Cold dates
        disease = "Influenza (Flu)"
        cases += np.random.randint(30, 80)
    elif aqi > 250:
        disease = "Asthma/Respiratory"
        cases += np.random.randint(20, 50)
    elif temp > 40:
        disease = "Heat Stroke"
        cases += np.random.randint(20, 40)
    
    # Inventory Logic
    stock_map = {
        "Dengue": "Platelets & IV Fluids",
        "Influenza (Flu)": "Antivirals & Paracetamol",
        "Asthma/Respiratory": "Nebulizers & Oxygen",
        "Heat Stroke": "Saline & Cooling Packs",
        "Normal": "General Supplies"
    }

    data.append([
        current_date, 
        day_of_year, 
        month, 
        round(temp, 1), 
        round(humidity, 1), 
        round(rainfall, 1), 
        int(aqi), 
        disease, 
        cases, 
        stock_map.get(disease, "General Supplies")
    ])

# Save
df = pd.DataFrame(data, columns=['Date', 'Day_of_Year', 'Month', 'Temp', 'Humidity', 'Rainfall', 'AQI', 'Disease', 'Cases', 'Medicine'])
df.to_csv('hospital_date_data.csv', index=False)
print("✅ Realistic Date-Based Dataset Generated!")