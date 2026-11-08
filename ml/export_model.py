import joblib
import numpy as np
import json
import os
import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("dataset.csv", header = None, on_bad_lines = "skip")

x = df.iloc[:, :42]
y = df.iloc[:, -1].astype(str)

y = y.str.strip()

mask = y.str.lower() != "fuck you"

X = x[mask]
y = y[mask]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, stratify = y, random_state = 42)

model = joblib.load("rf_model.joblib")

data = {
    "classes": [str(c) for c in model.classes_],
    "n_features": 42,
    "trees": []
}

for est in model.estimators_:
    t = est.tree_
    tree_data = {
        "left": t.children_left.tolist(),
        "right": t.children_right.tolist(),
        "feature": t.feature.tolist(),
        "threshold": np.round(t.threshold, 6).tolist(),
        "value": []
    }

    values = t.value[:,0,:]

    row_sums = values.sum(axis = 1, keepdims = True)

    probabilities = np.divide(
        values,
        row_sums,
        out = np.zeros_like(values, dtype = float),
        where = row_sums != 0
    )

    leaf_values = []
    for i in range(t.node_count):
        if t.children_left[i] == -1:
            leaf_values.append(
                np.round(probabilities[i], 3).tolist()
            )
        else:
            leaf_values.append(None)

    tree_data["value"] = leaf_values
    data["trees"].append(tree_data)


def predict_json(data, x):
    total = np.zeros(len(data["classes"]))
    for tree in data["trees"]:
        node = 0
        while tree["left"][node] != -1:
            feature = tree["feature"][node]
            threshold = tree["threshold"][node]

            if x[feature] <= threshold:
                node = tree["left"][node]
            else:
                node = tree["right"][node]

        total += np.array(tree["value"][node])
    return total/len(data["trees"])

for i in range(300):
    x = X_test.iloc[i].to_numpy()
    json_prediction = predict_json(data, x)
    predicted_class =  data["classes"][np.argmax(json_prediction)]
    actual_prediction = model.predict([x])[0]

    if predicted_class != actual_prediction:
        print("mistmatch at sample:", i)
        print("json prdiction:", predict_class)
        print("model prediction:", actual_prediction)

print("\nPrediction comparison completed")

project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
output_path = os.path.join(
    project_root,
    "hand-sign-web",
    "assets",
    "models",
    "rf_v1.json",
)

os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w") as f:
    json.dump(data, f, separators=(",", ":"))

size_bytes = os.path.getsize(output_path)
size_mb = size_bytes/(1024 * 1024)

print(output_path)
print("size: ", round(size_mb,2), "mb")