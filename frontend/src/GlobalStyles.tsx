// src/styles/GlobalStyle.tsx
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&family=Poppins:wght@400;600;700&display=swap');

  :root {
    --bg-1: #f3fbff;         /* soft sky */
    --bg-2: #eef9f7;         /* mint */
    --brand-blue: #0767d9;
    --brand-teal: #5cdb94;
    --deep: #042033;
    --muted: #6c8190;
    --card: #ffffff;
    --glass: rgba(255,255,255,0.55);
    --glass-strong: rgba(255,255,255,0.85);
    --shadow: 0 18px 40px rgba(7,41,89,0.06);
    --radius: 12px;
  }

  * { box-sizing: border-box; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
  html,body,#root { height: 100%; }
  body {
    margin: 0;
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: linear-gradient(180deg, var(--bg-1), var(--bg-2));
    color: var(--deep);
    -webkit-font-smoothing:antialiased;
  }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }

  /* Utility */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

  /* Buttons */
  .btn {
    border: none;
    font-weight: 700;
    padding: 12px 18px;
    border-radius: 12px;
    cursor: pointer;
  }
  .btn-primary {
    background: linear-gradient(90deg, var(--brand-blue), #2bb1ff 50%, var(--brand-teal));
    color: white;
    box-shadow: var(--shadow);
    transition: transform .18s ease, box-shadow .18s ease;
  }
  .btn-primary:hover { transform: translateY(-4px); box-shadow: 0 26px 50px rgba(7,58,107,0.12); }
  .btn-ghost {
    background: transparent;
    border: 2px solid rgba(7,103,217,0.08);
    color: var(--deep);
  }

  /* Cards */
  .card {
    background: var(--card);
    border-radius: var(--radius);
    padding: 18px;
    box-shadow: var(--shadow);
  }

  /* Tiny helpers */
  .muted { color: var(--muted); }
  .flex { display:flex; align-items:center; gap:12px; }

  /* Animations */
  @keyframes floatUp {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(92,219,148,0.18); }
    70% { box-shadow: 0 0 0 18px rgba(92,219,148,0); }
    100% { box-shadow: 0 0 0 0 rgba(92,219,148,0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ani-fade-up { animation: fadeInUp .6s ease both; }
  .ani-float { animation: floatUp 5s ease-in-out infinite; }
  .ani-pulse { animation: pulse 2s infinite; }

  /* Headings */
  h1, h2, h3 { font-family: "Poppins", sans-serif; margin:0; color:var(--deep); }
  h1 { font-size: clamp(28px, 4.4vw, 44px); letter-spacing:-0.6px; }
  p { margin: 0; color: var(--muted); line-height: 1.6; }

  /* Responsive tweaks */
  @media (max-width: 860px) {
    .container { padding: 0 14px; }
  }
`;
