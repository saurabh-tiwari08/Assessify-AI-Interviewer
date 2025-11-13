import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import styled from "styled-components";
import Webcam from "react-webcam";
import { MdCopyAll } from "react-icons/md";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Loader } from "./Loader";

type Question = {
  question: string;
  techStack: string;
};

export const Interview = () => {
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [text, setText] = useState("");
  const [isCopied, setCopied] = useClipboard(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFeed, setShowFeed] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const techStack = searchParams.get("techStack");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [render, setRender] = useState<boolean>(false);
  const [feedBack, setFeedBack] = useState<string>("");

  // word-limit helper (client-side safeguard)
  const truncateWords = (input: string, maxWords = 150) => {
    if (!input) return input;
    const words = input.trim().split(/\s+/);
    if (words.length <= maxWords) return input;
    return words.slice(0, maxWords).join(" ") + " ...";
  };

  // start/stop mic
  const start = () => {
    alert("Interview Started");
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const handleTurnoff = () => SpeechRecognition.abortListening();
  const handleClear = () => {
    resetTranscript();
    setFeedBack("");
    setShowFeed(false);
  };

  const handleNextQuestion = () => {
    setShowFeed(false);
    resetTranscript();
    setCurrentIndex((prev) => (prev === questions?.length - 1 ? 0 : prev + 1));
    window.speechSynthesis.cancel();
  };

  const handlePrevious = () => {
    setShowFeed(false);
    resetTranscript();
    setCurrentIndex((prev) => (prev === 0 ? (questions?.length ? questions.length - 1 : 0) : prev - 1));
    window.speechSynthesis.cancel();
  };

  // ✅ FETCH QUESTIONS — with logging and better error handling
  useEffect(() => {
    setRender(true);
    const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:8080";
    const url = `${apiBase}/questions/get?techStack=${encodeURIComponent(techStack || "")}`;

    console.info("📡 Fetching questions from:", url);
    axios
      .get(url, { timeout: 10000 })
      .then((res) => {
        console.info("✅ Questions fetched:", res.data);
        setQuestions(res.data);
      })
      .catch((error) => {
        console.error("❌ Failed to load questions:", error);
        setQuestions([]);
        setFeedBack("⚠️ Failed to load questions. Check backend at " + apiBase);
      });
  }, [techStack]);

  // ✅ HANDLE SUBMIT — send POST JSON and expect { answer: "..." }
  const handleSubmit = async () => {
    // Guard: ensure a non-empty transcript (improves UX and prevents model asking for answer)
    const safeTranscript = transcript ? transcript.trim() : "";
    if (!safeTranscript || safeTranscript.length < 3) {
      alert("Please record your answer before submitting (speak for at least a few words).");
      return;
    }

    if (!questions || questions.length === 0) {
      alert("Questions not loaded. Please try again or check backend.");
      return;
    }

    setShowFeed(true);
    setIsLoading(true);
    SpeechRecognition.stopListening();

    // Build prompt (server will also enforce concise/150-word limit)
    const prompt = `Consider yourself an interviewer for a full stack web developer. Question: ${questions[currentIndex].question} Answer: ${safeTranscript}. Provide concise feedback (subject matter expertise & communication) with ratings 0-10, do not mention you are an AI.`;

    try {
      const botUrl = process.env.REACT_APP_BOT_URL || "http://localhost:8081";
      console.info("📡 Sending prompt to:", botUrl);
      console.info("Outgoing prompt length:", prompt.length);

      const res = await axios.post(
        `${botUrl}/bot/chat`,
        { prompt }, // backend expects "prompt" (and optionally "question")
        { headers: { "Content-Type": "application/json" }, timeout: 60000 }
      );

      // Expect backend to return only { answer: "plain text" }
      let answerRaw = res?.data?.answer ?? (res?.data ? JSON.stringify(res.data) : "");
      if (typeof answerRaw !== "string") answerRaw = String(answerRaw);

      // Client-side safeguard: truncate to 150 words if model returned longer text
      const answerTruncated = truncateWords(answerRaw, 150);

      console.info("✅ Feedback received (truncated if needed):", answerTruncated);
      setFeedBack(answerTruncated);
      setIsLoading(false);

      if (answerTruncated) {
        const value = new SpeechSynthesisUtterance(answerTruncated);
        window.speechSynthesis.speak(value);
      }
    } catch (error: any) {
      console.error("❌ API error:", error);
      const serverData = error?.response?.data;
      const message = serverData?.error ?? serverData?.message ?? "Something went wrong. Please try again.";
      setFeedBack(message);
      setIsLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) return null;

  return (
    <div>
      {render && (
        <DIV>
          {showFeed ? (
            <div className="feedback-container">
              <div className="feedback">
                <div>
                  <div className="student-answer">
                    <h1 className="student-answer-heading">Your Answer</h1>
                    <p>{transcript || "No answer recorded"}</p>
                  </div>
                </div>
                <div className="chat-feedback">
                  {isLoading === false && <p className="feedback-heading">Feedback</p>}
                  {isLoading ? (
                    <div className="loader">
                      <Loader />
                    </div>
                  ) : (
                    <p>{feedBack}</p>
                  )}
                </div>
              </div>
              {isLoading ? null : (
                <div className="next-prev-container">
                  <button disabled={isLoading} className="next-Question-btn" onClick={handlePrevious}>
                    Previous Question
                  </button>
                  <button className="next-Question-btn" onClick={handleNextQuestion} disabled={isLoading}>
                    Next Question
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="question-and-cam-container">
                <div className="question-container">
                  <h1>Question {currentIndex + 1}</h1>
                  <p className="question">
                    {currentIndex + 1}.{" "}
                    {questions.length > 0 && currentIndex < questions.length
                      ? questions[currentIndex].question
                      : "Loading question..."}
                  </p>
                  <p className="Caution">
                    Caution: Please do not refresh or use browser navigation buttons. Doing so may reset your progress.
                  </p>
                </div>
                <div className="cam-container">
                  <Webcam height="260px" />
                </div>
              </div>

              <div className="speech-text-container" onClick={() => setText(transcript)}>
                {transcript ? (
                  transcript
                ) : (
                  <h2 className="your_answer">
                    Click on Start button and start speaking, then submit your answer after completing...
                  </h2>
                )}
              </div>

              <div className="btn-contianer">
                <div>
                  <button className="btn copy" onClick={setCopied}>
                    {isCopied ? "Copied!" : "Copy"} <MdCopyAll className="copy-icon" />
                  </button>
                </div>
                <div>
                  <button className="btn" onClick={start} disabled={!browserSupportsSpeechRecognition}>
                    Start
                  </button>
                  <button className="btn stop" onClick={handleTurnoff}>
                    Stop
                  </button>
                  <button className="btn" onClick={handleClear}>
                    Clear
                  </button>
                  <button className="btn" onClick={handleSubmit} disabled={isLoading}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </DIV>
      )}
    </div>
  );
};

const DIV = styled.div`
  .speech-text-container {
    width: 90%;
    height: 250px;
    border: solid lightgray 1px;
    border-radius: 5px;
    margin: auto;
    margin-top: 10px;
    padding: 20px;
    text-align: start;
  }

  .question-and-cam-container {
    display: flex;
    width: 93%;
    margin: auto;
    height: 295px;
  }

  .question-container {
    width: 50%;
    text-align: left;
    padding: 20px;
  }

  .cam-container {
    width: 50%;
    display: flex;
    justify-content: right;
    padding-top: 30px;
  }

  .question {
    font-size: 18px;
    margin-left: 20px;
  }

  .your_answer {
    margin-left: 20px;
  }

  .btn-contianer {
    display: flex;
    justify-content: space-between;
    width: 94%;
    margin: auto;
  }

  .btn {
    padding: 10px 25px;
    border: solid lightgray 1px;
    margin: 10px 15px;
    border-radius: 5px;
    background-color: #05396b;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    color: white;
    font-weight: 700;
  }

  .btn:hover {
    background-color: #97afc6;
  }

  .copy {
    background-color: #5cdb94;
    font-weight: 900;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }

  .stop {
    background-color: #ff3d3d;
  }

  .stop:hover {
    background-color: #ddacac;
  }

  .copy-icon {
    font-size: 20px;
  }

  .feedback-container {
    padding: 20px;
    background-color: #0a2640;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .feedback {
    display: flex;
    justify-content: space-between;
  }

  .student-answer {
    width: 640px;
    height: 560px;
    border: solid lightgray 1px;
    background-color: #244361;
    color: white;
    border-radius: 5px;
    margin-right: 20px;
    padding: 0px 30px;
  }

  .chat-feedback {
    width: 700px;
    height: 560px;
    border: solid lightgray 1px;
    background-color: white;
    text-align: left;
    padding: 0px 30px;
    border-radius: 5px;
  }

  .student-answer-heading {
    color: #5cdb94;
  }

  .feedback-heading {
    font-size: 25px;
  }

  .next-Question-btn {
    padding: 10px 20px;
    margin: 10px;
    margin-top: 30px;
    border-radius: 3px;
    width: 200px;
    background-color: #5cdb94;
    color: black;
    font-weight: 600;
  }

  .next-Question-btn:hover {
    background-color: white;
    border: solid black 1px;
    color: black;
  }

  .Caution {
    font-size: 13px;
    border: solid red 1px;
    padding: 10px;
    border-radius: 5px;
    background-color: #fac8c8;
  }

  .next-prev-container {
    display: flex;
  }

  .loader {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
`;
