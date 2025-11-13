import { Link } from "react-router-dom";

export const InterviewTypes = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        margin: "40px",
        padding: "40px",
        gap: "40px",
      }}
    >
      {/* MERN Stack */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>MERN Stack</h1>
        <p style={descStyle}>Practice full-stack JavaScript (MongoDB, Express, React, Node).</p>
        <Link style={{ textDecoration: "none" }} to={"/interview/mern?techStack=mern"}>
          <button style={buttonStyle}>Start Interview</button>
        </Link>
      </div>

      {/* Node.js */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>Node.js</h1>
        <p style={descStyle}>Server-side JavaScript, async patterns, streams, Express.</p>
        <Link style={{ textDecoration: "none" }} to={"/interview/node?techStack=node"}>
          <button style={buttonStyle}>Start Interview</button>
        </Link>
      </div>

      {/* C++ */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>C++</h1>
        <p style={descStyle}>OOP, memory, pointers, STL, compile-time vs runtime concepts.</p>
        <Link style={{ textDecoration: "none" }} to={"/interview/cpp?techStack=cpp"}>
          <button style={buttonStyle}>Start Interview</button>
        </Link>
      </div>

      {/* Data Structures */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>Data Structures</h1>
        <p style={descStyle}>Arrays, lists, trees, graphs, algorithms, and complexity.</p>
        <Link style={{ textDecoration: "none" }} to={"/interview/dsa?techStack=dsa"}>
          <button style={buttonStyle}>Start Interview</button>
        </Link>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  boxShadow: "rgba(0, 0, 0, 0.08) 0px 8px 20px",
  width: "500px",
  padding: "32px",
  borderRadius: "12px",
  backgroundColor: "#fff",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  fontWeight: "700",
  fontSize: "28px",
  color: "#05396b",
};

const descStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "15px",
  color: "#33475b",
};

const buttonStyle: React.CSSProperties = {
  display: "block",
  backgroundColor: "#0767d9",
  margin: "20px auto 0",
  color: "white",
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "700",
};
