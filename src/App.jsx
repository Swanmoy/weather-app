import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Weather from "./components/weather";
import Error from "./components/error";
function App() {
  const locationRef = useRef(null);
  const handleSearch = () => {
    let location = locationRef.current.value;
    if (location) {
      axios
        .get("http://api.weatherapi.com/v1/forecast.json", {
          params: {
            key: process.env.REACT_APP_API_KEY,
            q: location,
            days: 5,
            aqi: "no",
            alerts: "no",
          },
        })
        .then((resp) => {
          console.log(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/weather/:location" element={<Weather />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
