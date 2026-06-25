import joblib
import os
import json

# Global variables to hold loaded models and metrics
placement_model = None
placement_metrics = None

def load_models():
    global placement_model, placement_metrics
    
    # Load Placement Model
    model_path = os.path.join('backend', 'models', 'placement_model.pkl')
    if os.path.exists(model_path):
        placement_model = joblib.load(model_path)
        print(f"Successfully loaded model from {model_path}")
    else:
        print(f"Warning: Model file not found at {model_path}")
        
    # Load Placement Metrics (for feature importance)
    metrics_path = os.path.join('backend', 'reports', 'placement_metrics.json')
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            placement_metrics = json.load(f)
        print(f"Successfully loaded metrics from {metrics_path}")
    else:
        print(f"Warning: Metrics file not found at {metrics_path}")

def get_placement_model():
    return placement_model

def get_placement_metrics():
    return placement_metrics
