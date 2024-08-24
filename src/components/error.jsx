import React from "react";
import "../styles/error.css";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="error-container">
        <p className="error-text">Opps Something went Wrong!!!</p>
        <div className="go-home-button" onClick={() => navigate("/")}>
          <i
            className="bi bi-arrow-left"
            style={{ color: "white", fontSize: "30px" }}
          ></i>
          <p className="go-back-text"> {"    "}Home</p>
        </div>
      </div>
    </>
  );
};

export default Error;
