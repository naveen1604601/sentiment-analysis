# imports
import os
import nltk
from flask import Flask, request, jsonify, send_from_directory
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pandas as pd

# app init
app = Flask(__name__, static_folder="./", static_url_path="")

# nltk setup
NLTK_DIR = os.path.join(os.getcwd(), "nltk_data")
os.makedirs(NLTK_DIR, exist_ok=True)
nltk.data.path.append(NLTK_DIR)
nltk.download("vader_lexicon", download_dir=NLTK_DIR)

# sentiment analyzer
sia = SentimentIntensityAnalyzer()

# ✅ ADD HERE
@app.route("/")
def home():
    return send_from_directory("./", "index.html")

# other routes
@app.route("/analyze", methods=["POST"])
def analyze():
    text = request.json["text"]
    score = sia.polarity_scores(text)["compound"]
    return jsonify(score)

# main
if __name__ == "__main__":
    app.run()