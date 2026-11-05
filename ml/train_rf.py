import pandas as pd 

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