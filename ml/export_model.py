import joblib
import numpy as np 
import json
import os

model = joblib.load("rf_model.joblib")

data = {
    "classes": [str(c) for c in model.classes_],
    "n_features": 42,
    "trees": []
}

