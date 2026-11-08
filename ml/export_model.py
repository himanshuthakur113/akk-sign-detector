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

    

print(data)