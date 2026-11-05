import pandas as pd 
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

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
