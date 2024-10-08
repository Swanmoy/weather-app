import Reac, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/weather.css";
const Weather = () => {
  const { location } = useParams();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [forecastWeather, setForecastWeather] = useState(null);
  const [unitToggle, setUnitToggle] = useState("C");

  const navigate = useNavigate();
  const formatDateTime = (input) => {
    const date = new Date(input.replace(" ", "T"));
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${time}-${dayOfWeek}, ${day} ${month}, ${year}`;
  };
  const formatDate = (input) => {
    const date = new Date(input);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month}, ${year}`;
  };
  useEffect(() => {
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
        let data = resp.data;
        let tempCurrWeather = {
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
          time: formatDateTime(data.current.last_updated),
          location: data.location.name,
          icon: data.current.condition.icon,
          description: data.current.condition.text,
          temp_max_f: data.forecast.forecastday[0].day.maxtemp_f,
          temp_max_c: data.forecast.forecastday[0].day.maxtemp_c,
          temp_min_f: data.forecast.forecastday[0].day.mintemp_f,
          temp_min_c: data.forecast.forecastday[0].day.mintemp_c,
          humidity: data.current.humidity,
          cloud: data.current.cloud,
          wind_kph: data.current.wind_kph,
        };
        let tempHourWeather = data.forecast.forecastday[0].hour.map(
          (hourData) => {
            return {
              time: hourData.time.substr(hourData.time.length - 4),
              temp_c: hourData.temp_c,
              temp_f: hourData.temp_f,
              icon: hourData.condition.icon,
              description: hourData.condition.text,
            };
          }
        );
        let tempForecastWeather = data.forecast.forecastday.map(
          (forecastData) => {
            return {
              maxtemp_c: forecastData.day.maxtemp_c,
              maxtemp_f: forecastData.day.maxtemp_f,
              mintemp_c: forecastData.day.mintemp_c,
              mintemp_f: forecastData.day.mintemp_f,
              icon: forecastData.day.condition.icon,
              time: formatDate(forecastData.date),
            };
          }
        );
        setCurrentWeather(tempCurrWeather);
        setHourlyWeather(tempHourWeather);
        setForecastWeather(tempForecastWeather);
      })
      .catch((err) => {
        console.log(err);
        navigate("/error");
      });
  }, [location]);
  return (
    <>
      <>
        {currentWeather && hourlyWeather && forecastWeather ? (
          <div className="weather-container">
            <div className="left-container">
              <div
                className="go-back-home-button"
                onClick={() => navigate("/")}
              >
                <i
                  className="bi bi-arrow-left"
                  style={{ color: "white", fontSize: "30px" }}
                ></i>
                <p className="go-back-text"> {"    "}Search for Another City</p>
              </div>
              {currentWeather && (
                <div className="current-temp-container">
                  <span className="current-temp">
                    {`${
                      unitToggle == "F"
                        ? currentWeather.temp_f
                        : currentWeather.temp_c
                    }°`}
                  </span>
                  <div className="loc-date-container">
                    <p className="location">{currentWeather.location}</p>
                    <div className="current-time">{currentWeather.time}</div>
                  </div>
                  <div className="current-weather-icon">
                    <img
                      src={currentWeather.icon}
                      style={{ backgroundColor: "none" }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="right-container">
              <div className="current-temp-readings">
                <div className="right-heading-container">
                  <p className="right-heading">Current Weather Details</p>
                  <p className="unit">Unit: </p>
                  <div
                    className="form-check form-check-inline"
                    onClick={() => setUnitToggle("C")}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="unitOptions1"
                      id="celsius"
                      checked={unitToggle === "C"}
                      value="C"
                    />
                    <label class="form-check-label" for="unitOptions1">
                      Celsius
                    </label>
                  </div>
                  <div
                    class="form-check form-check-inline"
                    onClick={() => setUnitToggle("F")}
                  >
                    <input
                      class="form-check-input"
                      type="radio"
                      name="unitOptions2"
                      id="farenheit"
                      checked={unitToggle === "F"}
                      value="F"
                    />
                    <label class="form-check-label" for="unitOptions2">
                      Farenheit
                    </label>
                  </div>
                </div>
                <p className="weather-description">
                  {currentWeather.description}
                </p>
                <div className="current-conditions">
                  <p className="description">Temp max</p>
                  <p className="unit">{`${
                    unitToggle === "C"
                      ? currentWeather.temp_max_c
                      : currentWeather.temp_max_f
                  }°`}</p>
                  <span className="icon">
                    <i
                      className="bi bi-thermometer-half"
                      style={{ fontSize: "24px", color: "red" }}
                    ></i>
                  </span>
                </div>
                <div className="current-conditions">
                  <p className="description">Temp min</p>
                  <p className="unit">{`${
                    unitToggle === "C"
                      ? currentWeather.temp_min_c
                      : currentWeather.temp_min_f
                  }°`}</p>
                  <span className="icon">
                    <i
                      className="bi bi-thermometer-half"
                      style={{ fontSize: "24px", color: "#0066cc" }}
                    ></i>
                  </span>
                </div>
                <div className="current-conditions">
                  <p className="description">Humidity</p>
                  <p className="unit">{`${currentWeather.humidity}%`}</p>
                  <span className="icon">
                    <i
                      className="bi bi-droplet-half"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </span>
                </div>
                <div className="current-conditions">
                  <p className="description">Cloud</p>
                  <p className="unit">{`${currentWeather.cloud}%`}</p>
                  <span className="icon">
                    <i
                      className="bi bi-clouds"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </span>
                </div>
                <div className="current-conditions">
                  <p className="description">Wind</p>
                  <p className="unit">{`${currentWeather.wind_kph}Km/h`}</p>
                  <span className="icon">
                    <i
                      className="bi bi-wind"
                      style={{ fontSize: "24px", color: "white" }}
                    ></i>
                  </span>
                </div>
              </div>
              <div className="vertical-divider"></div>
              <p className="hourly-forecast-heading">Hourly Forecast</p>
              <div className="hourly-weather">
                {hourlyWeather.map((hw) => {
                  return (
                    <>
                      <div className="hourly-reading">
                        <span className="icon">
                          <img
                            src={hw.icon}
                            style={{ backgroundColor: "none" }}
                          />
                        </span>
                        <div className="time-desc-container">
                          <p className="time">{hw.time}</p>
                          <p className="description">{hw.description}</p>
                        </div>
                        <p className="temp">{`${
                          unitToggle === "C" ? hw.temp_c : hw.temp_f
                        }°`}</p>
                      </div>
                    </>
                  );
                })}
              </div>
              <div className="vertical-divider"></div>
              <p className="day-forecast-heading">5 Day Forecast</p>
              <div className="forecast-weather">
                {forecastWeather.map((fw) => {
                  return (
                    <>
                      <div className="day-reading">
                        <span className="icon">
                          <img
                            src={fw.icon}
                            alt=""
                            style={{ backgroundColor: "none" }}
                          />
                        </span>
                        <p className="time">{fw.time}</p>
                        <div className="max-min-temp-container">
                          <p className="min-temp">{`Min- ${
                            unitToggle === "C" ? fw.mintemp_c : fw.mintemp_f
                          }°`}</p>
                          <p className="max-temp">{`Max- ${
                            unitToggle === "C" ? fw.maxtemp_c : fw.maxtemp_f
                          }°`}</p>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div class="spinner-border text-primary" role="status"></div>
          </>
        )}
      </>
    </>
  );
};

export default Weather;
