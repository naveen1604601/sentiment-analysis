import os
import nltk
import pandas as pd
from flask import Flask, jsonify, send_from_directory
from nltk.sentiment.vader import SentimentIntensityAnalyzer

app = Flask(__name__, static_folder="./", static_url_path="")

# NLTK setup
NLTK_DIR = os.path.join(os.getcwd(), "nltk_data")
os.makedirs(NLTK_DIR, exist_ok=True)
nltk.data.path.append(NLTK_DIR)
nltk.download("vader_lexicon", download_dir=NLTK_DIR)

sia = SentimentIntensityAnalyzer()

@app.route("/")
def home():
    return send_from_directory("./", "index.html")

@app.route("/data")
def data():
    df = pd.read_csv("Amazon_Reviews.csv")

    data = []
    for _, row in df.iterrows():
        score = sia.polarity_scores(str(row["Review Title"]))["compound"]

        if score > 0.05:
            sentiment = "Positive"
        elif score < -0.05:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

        data.append({
            "Country": row["Country"],
            "Reviewer Name": row["Reviewer Name"],
            "Rating": row["Rating"],
            "Review Title": row["Review Title"],
            "Sentiment": sentiment
        })

    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)