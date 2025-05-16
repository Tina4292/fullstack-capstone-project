// Task 1: Import the Natural library
const express = require("express");
const SentimentAnalyzer = require("natural").SentimentAnalyzer;
const stemmer = require("natural").PorterStemmer;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Task 2: Initialize the Express server
app.use(cors());
app.use(bodyParser.json());

// Initialize Natural sentiment analyzer
const analyzer = new SentimentAnalyzer("English", stemmer, "afinn");

// Task 3: Create a POST /sentiment endpoint
app.post("/sentiment", (req, res) => {
  try {
    // Task 4: Extract the sentence from the request body
    const sentence = req.body.sentence;

    if (!sentence || typeof sentence !== "string") {
      return res.status(400).json({ error: "Invalid or missing 'sentence' parameter." });
    }

    const tokenized = sentence.split(" ");

    // Task 5: Analyze sentiment score
    const score = analyzer.getSentiment(tokenized);

    let sentiment;
    if (score < 0) {
      sentiment = "negative";
    } else if (score >= 0 && score <= 0.33) {
      sentiment = "neutral";
    } else {
      sentiment = "positive";
    }

    // Task 6: Send success response
    res.json({
      sentence,
      score,
      sentiment
    });
  } catch (error) {
    // Task 7: Handle errors
    console.error("Sentiment analysis error:", error);
    res.status(500).json({ error: "Sentiment analysis failed" });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Sentiment analysis server is running on port ${PORT}`);
});
