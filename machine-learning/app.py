import pandas as pd
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import io

# Initialize the Flask app
app = Flask(__name__)

# Global variable to hold the trained model
trained_model = None

# Function to train the model
def train_model(csv_data, model_type, target_column):
    global trained_model

    # Read CSV data into a DataFrame
    df = pd.read_csv(io.StringIO(csv_data))
    
    # Separate features and target
    X = df.drop(columns=target_column)
    y = df[target_column]
    
    # Preprocessing (Standardizing numeric and encoding categorical features)
    numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X.select_dtypes(include=['object']).columns.tolist()
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(), categorical_features)
        ])
    
    # Select model type
    if model_type == "LinearRegression":
        model = LinearRegression()
    elif model_type == "RandomForest":
        model = RandomForestRegressor()
    elif model_type == "DecisionTree":
        model = DecisionTreeRegressor()
    else:
        raise ValueError("Invalid model type. Choose from 'LinearRegression', 'RandomForest', or 'DecisionTree'.")
    
    # Create a pipeline with preprocessing and model
    pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('model', model)])
    
    # Train the model
    pipeline.fit(X, y)
    
    # Store the trained model
    trained_model = pipeline

# Function to make predictions
def make_predictions(input_data):
    global trained_model
    if trained_model is None:
        return None
    
    # Convert input data into DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Predict using the trained model
    prediction = trained_model.predict(input_df)
    
    return prediction[0]

# Endpoint for training the model
@app.route('/train', methods=['POST'])
def train():
    data = request.get_json()
    
    # Get the CSV data, model type, and target column from the request
    csv_data = data.get('csv_data')
    model_type = data.get('model_type')
    target_column = data.get('target_column')
    
    if not csv_data or not model_type or not target_column:
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        # Train the model with the provided data and model type
        train_model(csv_data, model_type, target_column)
        return jsonify({"message": "Model trained successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Ensure model has been trained
    if trained_model is None:
        return jsonify({"error": "Model is not trained yet"}), 400
    
    # Get the input data for prediction
    input_data = data.get('input_data')
    
    if not input_data:
        return jsonify({"error": "Missing input data for prediction"}), 400
    
    # Make prediction using the trained model
    prediction = make_predictions(input_data)
    
    if prediction is None:
        return jsonify({"error": "Prediction failed"}), 400
    
    return jsonify({"prediction": prediction})

if __name__ == '__main__':
    app.run(debug=True)
