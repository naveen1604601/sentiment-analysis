from flask import Flask, jsonify, send_from_directory
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer

app = Flask(__name__, static_folder="../", static_url_path="")

sia = SentimentIntensityAnalyzer()

@app.route("/")
def home():
    return send_from_directory("../", "index.html")

@app.route("/data")
def data():
    df = pd.read_csv(
        "Amazon_Reviews.csv",
        engine="python",
        on_bad_lines="skip"
    )
    df = df.fillna("")

    def get_sentiment(text):
        score = sia.polarity_scores(text)["compound"]
        if score >= 0.05:
            return "Positive"
        elif score <= -0.05:
            return "Negative"
        else:
            return "Neutral"

    df["Sentiment"] = df["Review Text"].apply(get_sentiment)

    return jsonify(df.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)
 