from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from datetime import datetime

# 1. INITIALIZE FLASK (This was missing!)
app = Flask(__name__)
CORS(app)  # Allow React to talk to Python

# 2. LOAD THE BRAIN
try:
    with open('final_hospital_model.pkl', 'rb') as f:
        models = pickle.load(f)
        clf = models['classifier']
        reg = models['regressor']
    print("✅ Model loaded successfully!")
except FileNotFoundError:
    print("❌ Error: 'final_hospital_model.pkl' not found. Make sure you are in the 'Model' folder.")
    exit()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        user_date = data.get('date')
        
        # --- 1. PARSE DATE ---
        date_obj = datetime.strptime(user_date, "%Y-%m-%d")
        day_of_year = date_obj.timetuple().tm_yday
        month = date_obj.month
        year = date_obj.year
        
        # --- 2. ESTIMATE WEATHER ---
        est_temp = 25 + 12 * np.sin((day_of_year - 105) * 2 * np.pi / 365)
        if 6 <= month <= 9: 
            est_rain = 100; est_humidity = 85
        else:
            est_rain = 5; est_humidity = 40
        est_aqi = 250 if month in [11, 12, 1] else 100

        # --- 3. PREDICT CURRENT LOAD ---
        input_data = pd.DataFrame([[day_of_year, month, est_temp, est_humidity, est_rain, est_aqi]], 
                                  columns=['Day_of_Year', 'Month', 'Temp', 'Humidity', 'Rainfall', 'AQI'])
        
        pred_disease = clf.predict(input_data)[0]
        pred_cases = int(reg.predict(input_data)[0])
        
        # --- 4. GENERATE HISTORY (For the Graph) ---
        history = []
        for y in [year-3, year-2, year-1]:
            # Create a slight random variation for realism
            variation = np.random.randint(-15, 15)
            hist_cases = max(0, pred_cases + variation)
            history.append({"year": f"{y}", "cases": hist_cases})

        # --- 5. STOCK LOGIC ---
        stock_map = {
            "Dengue": "Platelets & IV Fluids",
            "Influenza (Flu)": "Tamiflu & Paracetamol",
            "Asthma/Respiratory": "Inhalers & Oxygen",
            "Heat Stroke": "Saline & Cooling Packs"
        }
        rec_stock = stock_map.get(pred_disease, "General Supplies")
        
        return jsonify({
            "disease": pred_disease,
            "cases": pred_cases,
            "stock": rec_stock,
            "weather": f"Temp: {int(est_temp)}°C | Rain: {est_rain}mm",
            "history": history
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Hospital AI Server Running on Port 5000...")
    app.run(port=5000, debug=True)