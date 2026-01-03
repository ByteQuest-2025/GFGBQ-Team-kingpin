import pandas as pd
import numpy as np
import pickle  # <--- vital import
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error

# 1. Load Data
df = pd.read_csv('hospital_date_data.csv')

X = df[['Day_of_Year', 'Month', 'Temp', 'Humidity', 'Rainfall', 'AQI']]
y_disease = df['Disease']
y_cases = df['Cases']

# 2. Split Data
X_train, X_test, y_dis_train, y_dis_test = train_test_split(X, y_disease, test_size=0.2, random_state=42)
X_train, X_test, y_case_train, y_case_test = train_test_split(X, y_cases, test_size=0.2, random_state=42)

# 3. Train
print("Training Disease Model...")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_dis_train)

print("Training Patient Count Model...")
reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train, y_case_train)

# 4. Test (Verify Accuracy)
dis_predictions = clf.predict(X_test)
accuracy = accuracy_score(y_dis_test, dis_predictions)
print(f"✅ Disease Model Accuracy: {accuracy * 100:.2f}%")

case_predictions = reg.predict(X_test)
mae = mean_absolute_error(y_case_test, case_predictions)
print(f"✅ Patient Count Error: +/- {int(mae)} patients")

# 5. SAVE (The most important part)
with open('final_hospital_model.pkl', 'wb') as f:
    pickle.dump({'classifier': clf, 'regressor': reg}, f)

print("✅ Model file created: final_hospital_model.pkl")