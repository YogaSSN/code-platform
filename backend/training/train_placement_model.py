import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

def train_model():
    dataset_path = os.path.join('backend', 'training', 'placement_training_dataset.csv')
    df = pd.read_csv(dataset_path)
    
    features = [
        'problems_solved', 'easy_solved', 'medium_solved', 'hard_solved',
        'arrays_count', 'strings_count', 'graphs_count', 'dp_count', 'trees_count',
        'contest_rating', 'contest_count', 'acceptance_rate', 'current_streak',
        'room_participations', 'room_wins'
    ]
    target = 'placement_score'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"MAE: {mae:.2f}")
    print(f"R² Score: {r2:.2f}")
    
    # Save model
    models_dir = os.path.join('backend', 'models')
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, 'placement_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")
    
    # Save metrics
    reports_dir = os.path.join('backend', 'reports')
    os.makedirs(reports_dir, exist_ok=True)
    
    # Feature importance
    importance = model.feature_importances_
    feature_importance_dict = {f: float(i) for f, i in zip(features, importance)}
    
    metrics = {
        "MAE": float(mae),
        "R2_Score": float(r2),
        "Validation_Results": "Passed" if r2 > 0.8 else "Needs Improvement",
        "Feature_Importance": feature_importance_dict
    }
    
    metrics_path = os.path.join(reports_dir, 'placement_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print(f"Metrics saved to {metrics_path}")

if __name__ == "__main__":
    train_model()
