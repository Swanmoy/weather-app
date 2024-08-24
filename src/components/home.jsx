import React, { useState, useRef, useEffect } from "react";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const locationRef = useRef(null);
  const navigate = useNavigate();
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const location = locationRef.current.value;
      if (location) {
        navigate(`/weather/${location}`);
      }
    }
  };
  return (
    <>
      <div className="home-container">
        <div className="search-container">
          <input
            type="text"
            ref={locationRef}
            placeholder="Enter a Location or City to Search"
            onKeyDown={handleSearch}
            className="search-container-search-input"
          />
          <i
            className="bi bi-search"
            style={{ fontSize: 30, color: "white" }}
          ></i>
        </div>
      </div>
    </>
  );
};

export default Home;
