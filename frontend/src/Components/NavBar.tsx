import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/pngwing3.png";

export const NavBar = () => {
  return (
    <NAV>
      <div className="left">
        <Link to="/" className="brand">
          <img src={Logo} alt="Assessify logo" className="logo" />
          <span className="brand-name">Assessify</span>
        </Link>
      </div>

      <div className="right">
        <Link className="link" to={"/"}>
          Home
        </Link>
        <Link className="link" to={"/interviews"}>
          Interviews
        </Link>
        <Link className="link" to={"/about"}>
          About
        </Link>
        <Link className="link" to={"/contact"}>
          Contact
        </Link>
      </div>
    </NAV>
  );
};

const NAV = styled.nav`
  width: 100%;
  height: 70px;
  padding: 0 60px;
  background: linear-gradient(90deg, #0767d9 0%, #5cdb94 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 10px;
  font-family: "Poppins", sans-serif;
  box-sizing: border-box;

  .left {
    display: flex;
    align-items: center;
  }

  .brand {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo {
    width: 42px;
    height: auto;
    margin-right: 10px;
  }

  .brand-name {
    font-size: 26px;
    font-weight: 700;
    background: linear-gradient(90deg, #ffffff, #f2fff8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 0.6px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
    transition: 0.3s ease;
  }

  .link:hover {
    color: #052033;
    background-color: rgba(255, 255, 255, 0.15);
    padding: 6px 10px;
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    padding: 0 24px;
    height: 60px;

    .brand-name {
      font-size: 20px;
    }

    .link {
      font-size: 14px;
      margin: 0 4px;
    }

    .right {
      gap: 14px;
    }
  }
`;
