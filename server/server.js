import express from "express";
import mongoose from "mongoose";
import Score from "./models/Score.js";
import cors from "cors";

const app = express();

// middlewares for the backend
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(
    "mongodb+srv://agamtyagi:testpassword123@cluster0.l2pxa.mongodb.net/velocikeys"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// endpoint to submit the score that user achieves after the typing test
app.post("/submit-score", async (req, res) => {
  try {
    const { username, score } = req.body;

    if (!username || !score) {
      return res.status(400).send("Username and score are required.");
    }
    console.log({ username, score });
    await Score.create({ username, score });

    res.status(201).send("Score submitted successfully.");
  } catch (error) {
    res.status(500).send("Server error. Unable to submit score.");
  }
});

// endpoint to get the leaderboard
app.get("/leaderboard", async (req, res) => {
  try {
    const topScores = await Score.find({}).sort({ score: -1 }).limit(10).exec();

    if (topScores.length === 0) {
      return res.status(404).send("No scores found.");
    }

    res.status(200).json(topScores);
  } catch (error) {
    console.error("Error fetching top 10 scores:", error);
    res.status(500).send("Server error. Unable to fetch top 10 scores.");
  }
});

// endpoint to get highscore of the logged in user
app.post("/highscore", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const scores = await Score.find({ username });

    const highScore = scores.length === 0 ? 0 : Math.max(...scores.map((score) => score.score));

    res.json({ username, highScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// endpoint to get all scores for the my stats page
app.post('/get-scores', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const scores = await Score.find({ username });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(8000, () => console.log("Server running on 8000"));
