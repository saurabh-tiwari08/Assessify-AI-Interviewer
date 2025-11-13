import React from "react";
import styled from "styled-components";
import { FaRobot, FaBrain, FaCode, FaMicrophone } from "react-icons/fa";

export const About = () => {
  return (
    <Container>
      <div className="hero-section">
        <h1>About <span className="brand">Assessify</span></h1>
        <p className="tagline">
          Assessify — your AI-powered interviewer that listens, evaluates, and helps you improve.
        </p>
      </div>

      <div className="info-section">
        <p>
          <strong>Assessify</strong> simulates real technical interviews across MERN, Node.js, C++, and Data Structures.
          It transcribes spoken answers, evaluates subject knowledge and communication, and returns concise, actionable feedback.
        </p>

        <p>
          The system integrates speech recognition, generative AI, and full-stack engineering to provide a realistic interview practice experience.
          Use Assessify to train faster, measure progress, and build confidence before real interviews.
        </p>
      </div>

      <div className="feature-section">
        <h2>🚀 Key Features</h2>
        <div className="features">
          <div className="feature">
            <FaMicrophone className="icon" />
            <h3>Voice-Based Interview</h3>
            <p>Answer verbally while Assessify listens, transcribes, and evaluates in real time.</p>
          </div>
          <div className="feature">
            <FaRobot className="icon" />
            <h3>AI-Powered Feedback</h3>
            <p>Get concise, structured feedback (≤150 words) with ratings for expertise and communication.</p>
          </div>
          <div className="feature">
            <FaBrain className="icon" />
            <h3>Progress Tracking</h3>
            <p>Practice repeatedly and track improvement over time with consistent scoring.</p>
          </div>
          <div className="feature">
            <FaCode className="icon" />
            <h3>Focused Topics</h3>
            <p>Practice MERN, Node.js, C++, and Data Structures with curated questions and fallback support.</p>
          </div>
        </div>
      </div>

      <div className="footer-section">
        <p>
          Built with ❤️ by SAURABH TIWARI using <span className="highlight">React</span>, <span className="highlight">Spring Boot</span>, and <span className="highlight">Gemini AI</span>.
        </p>
        <p>© {new Date().getFullYear()} Assessify. All rights reserved.</p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 48px 6vw;
  background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
  color: #052035;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;

  .hero-section {
    text-align: center;
    margin-bottom: 36px;
    padding: 28px;
    border-radius: 16px;
    background: linear-gradient(90deg, rgba(92,219,148,0.12), rgba(5,57,107,0.06));
    box-shadow: 0 6px 24px rgba(5,57,107,0.06);
  }

  .hero-section h1 {
    font-size: 44px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin: 0;
  }

  .brand {
    color: #0767d9;
    background: linear-gradient(90deg, #0767d9, #5cdb94);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .tagline {
    font-size: 16px;
    color: #244361;
    margin-top: 10px;
  }

  .info-section {
    font-size: 16px;
    line-height: 1.8;
    margin: 36px auto;
    max-width: 1000px;
    text-align: left;
  }

  .feature-section h2 {
    text-align: center;
    font-size: 28px;
    margin-bottom: 22px;
    color: #073b6b;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin: 0 auto;
    max-width: 1200px;
  }

  .feature {
    background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,252,255,0.9));
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 6px 18px rgba(7,41,89,0.06);
    transition: transform 220ms ease, box-shadow 220ms ease;
  }

  .feature:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(7,41,89,0.12);
  }

  .feature h3 { color: #063b6a; margin-top: 12px; font-size: 18px; }
  .feature p { color: #225; font-size: 14px; margin-top: 8px; }

  .icon { font-size: 30px; color: #5cdb94; }

  .footer-section {
    margin-top: 42px;
    text-align: center;
    font-size: 14px;
    color: #244361;
  }

  .highlight { font-weight: 700; color: #0767d9; }
`;
