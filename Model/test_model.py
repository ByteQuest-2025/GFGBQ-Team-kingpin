import pickle
import pandas as pd
import numpy as np
from datetime import datetime

# 1. LOAD THE BRAIN
print("Loading the model...")
with open('final_hospital_model.pkl', 'rb') as f:
    models = pickle.load(f)
    clf = models['classifier']
    reg = models['regressor']

def get_prediction(user_date):
    try:
        # 2. CONVERT DATE TO NUMBERS
        date_obj = datetime.strptime(user_date, "%Y-%m-%d")
        day_of_year = date_obj.timetuple().tm_yday
        month = date_obj.month
        
        # 3. ESTIMATE WEATHER (The "Middleman")
        # The model needs weather data. We estimate it based on the date.
        
        # Temp: Cold in Jan (Day 1), Hot in May (Day 150)
        # Using a Sine wave for smooth transition
        est_temp = 25 + 12 * np.sin((day_of_year - 105) * 2 * np.pi / 365)
        
        # Rain/Humidity: High only in Monsoon (June-Sept)
        if 6 <= month <= 9:
            est_rain = 100
            est_humidity = 85
        else:
            est_rain = 5
            est_humidity = 40
            
        # AQI: High in Winter (Nov, Dec, Jan)
        est_aqi = 250 if month in [11, 12, 1] else 100

        # 4. PREPARE INPUT FOR AI
        input_data = pd.DataFrame([[day_of_year, month, est_temp, est_humidity, est_rain, est_aqi]], 
                                  columns=['Day_of_Year', 'Month', 'Temp', 'Humidity', 'Rainfall', 'AQI'])
        
        # 5. GET PREDICTION
        pred_disease = clf.predict(input_data)[0]
        pred_count = int(reg.predict(input_data)[0])
        
        # Inventory Logic (Simple mapping)
        stock_map = {
            "Dengue": "Platelets & IV Fluids",
            "Influenza (Flu)": "Tamiflu & Paracetamol",
            "Asthma/Respiratory": "Inhalers & Oxygen",
            "Heat Stroke": "Saline & Cooling Packs",
            "Normal": "Standard Supplies"
        }
        recommended_stock = stock_map.get(pred_disease, "Standard Supplies")

        return {
            "Disease": pred_disease,
            "Cases": pred_count,
            "Stock": recommended_stock,
            "Weather_Context": f"Temp: {int(est_temp)}°C | Rain: {est_rain}mm"
        }

    except ValueError:
        return "Error: Please enter date in YYYY-MM-DD format (e.g., 2025-07-20)"

# --- LOOP TO LET YOU TEST REPEATEDLY ---
while True:
    print("\n" + "="*40)
    user_input = input("Enter a Date (YYYY-MM-DD) or 'q' to quit: ")
    
    if user_input.lower() == 'q':
        break
        
    result = get_prediction(user_input)
    
    if isinstance(result, dict):
        print(f"\n🔮 PREDICTION FOR {user_input}:")
        print(f"   🦠 Outbreak Risk:   {result['Disease']}")
        print(f"   🚑 Expected Cases:  {result['Cases']}")
        print(f"   📦 Stock To Order:  {result['Stock']}")
        print(f"   ☁️  Weather Context: {result['Weather_Context']}")
    else:
        print(result)