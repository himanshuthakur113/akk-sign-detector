import pandas as pd 
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import json

df = pd.read_csv("dataset.csv", header = None, on_bad_lines = "skip")

print("Dataset shape:",df.shape)

x = df.iloc[:, :42]
y = df.iloc[:, -1].astype(str)

y = y.str.strip()

mask = y.str.lower() != "fuck you"

X = x[mask]
y = y[mask]

print("\nFeature shape:", X.shape)
print("\nNumber of features:", X.shape[1])

print("\nClass distribution:")
print(y.value_counts())

print("\nUnique classes:")
print(sorted(y.unique()))

assert X.shape[1] == 42, "Expected 42 features"

print("\n Dataset loaded successfully")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, stratify = y, random_state = 42)

print("training sample:", X_train.shape[0])

print("testing samples:", X_test.shape[0])

model = RandomForestClassifier(
    n_estimators = 50,
    max_depth = 12,
    min_samples_leaf = 2,
    random_state = 42
)

model.fit(X_train, y_train)
print("\nRandom Forest training completed!")

accuracy = model.score(X_test, y_test)
print("\nModel accuracy:" , accuracy)

y_pred = model.predict(X_test)

print("\n Classification Report: ")
print(classification_report(y_test, y_pred))

total_nodes = sum(
        tree.tree_.node_count
        for tree in model.estimators_
        )

print("\nTotal trees:", len(model.estimators_))
print("total nodes:", total_nodes)
print("estimated json size", total_nodes * 100/(1024* 1024), "MB")

joblib.dump(model, "rf_model.joblib")

with open("classes.json", "w") as f:
    json.dump(list(model.classes_), f)

print("\n model and classes saved successfully")