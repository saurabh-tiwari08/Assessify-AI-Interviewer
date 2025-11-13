import React from "react";
import styled from "styled-components";

export const Contact = () => {
  return (
    <Container>
      <Card>
        <h2>Contact</h2>
        <p>
          <strong>Name:</strong> Saurabh Tiwari
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:saurabh03tiwari@gmail.com">
            saurabh03tiwari@gmail.com
          </a>
        </p>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: linear-gradient(135deg, #e0f7fa, #e8f5e9);
  font-family: "Poppins", sans-serif;
`;

const Card = styled.div`
  background: white;
  padding: 40px 60px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(7, 41, 89, 0.12);
  text-align: center;

  h2 {
    color: #05396b;
    font-size: 28px;
    margin-bottom: 20px;
  }

  p {
    color: #333;
    font-size: 18px;
    margin: 10px 0;
  }

  a {
    color: #0767d9;
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }
`;
