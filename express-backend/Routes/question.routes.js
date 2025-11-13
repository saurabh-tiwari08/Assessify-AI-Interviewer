const express = require("express");
const { QuestionModel } = require("../Models/Question.model");
const { FALLBACK_QUESTIONS } = require("../fallbackQuestions");

const QuestionRouter = express.Router();

// ✅ Add question API
QuestionRouter.post("/add", async (req, res) => {
  try {
    const newQuestion = new QuestionModel(req.body);
    await newQuestion.save();
    return res.status(200).json({ msg: "New Question has been Added" });
  } catch (error) {
    console.warn("DB write failed, falling back to in-memory:", error.message);
    FALLBACK_QUESTIONS.push({
      question: req.body.question || "(no question provided)",
      techStack: req.body.techStack || "general",
    });
    return res.status(200).json({ msg: "New Question added to fallback store" });
  }
});

// ✅ Get questions by techStack (handles case-insensitive, empty, or missing param)
QuestionRouter.get("/get", async (req, res) => {
  const raw = req.query.techStack;
  const techStack = typeof raw === "string" ? raw.trim().toLowerCase() : "";

  try {
    // Build query conditionally
    let query = {};
    if (techStack) {
      query = { techStack: { $regex: `^${techStack}$`, $options: "i" } };
    }

    const questions = await QuestionModel.find(query);

    if (!questions || questions.length === 0) {
      // Fallback if DB empty or filtered out
      const fallback = techStack
        ? FALLBACK_QUESTIONS.filter((q) => {
            const t = (q.techStack || "").trim().toLowerCase();
            return t === techStack || t === "general";
          })
        : FALLBACK_QUESTIONS;
      return res.status(200).json(fallback);
    }

    return res.status(200).json(questions);
  } catch (error) {
    console.warn("DB read failed, returning fallback:", error.message);
    const fallback = techStack
      ? FALLBACK_QUESTIONS.filter((q) => {
          const t = (q.techStack || "").trim().toLowerCase();
          return t === techStack || t === "general";
        })
      : FALLBACK_QUESTIONS;
    return res.status(200).json(fallback);
  }
});

module.exports = {
  QuestionRouter,
};
