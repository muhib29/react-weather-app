  import React, { useState } from "react";
  const api_key = "9893be2ddd99bcd30677a2ef918cac79";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="; 
  const App = () => {
    const [city, setCity] = useState("Karachi"); 
    const [weatherData, setWeatherData] = useState(null); 
    const [showweatherdata, setshowweatherdata] = useState(false);
    const [weatherIcon, setWeatherIcon] = useState("");
    const weatherUpdate = async (city) => {
      try {
        const response = await fetch(apiUrl + city + `&appid=${api_key}`);
        if (!response.ok) {
          throw new Error("City not found");
        }
        let data = await response.json();
          setWeatherData(data)
          
          if (data.weather[0].main === "Clouds") {
            setWeatherIcon("images/cloudy.png");
          } else if (data.weather[0].main === "Clear") {
            setWeatherIcon("images/clear.png");
          } else if (data.weather[0].main === "Rain") {
            setWeatherIcon("images/rainy.png");
          } else if (data.weather[0].main === "Snow") {
            setWeatherIcon("images/snow.png");
          } else if (data.weather[0].main === "Drizzle") {
            setWeatherIcon("images/drizle.png");
          }else if (data.weather[0].main === "Mist") {
            setWeatherIcon("images/mist.png");
          } else {
            setWeatherIcon(""); 
          }
        } catch (error) {
          console.error("Error fetching the weather data: ", error.message);
        }
      };
    

    const handleSearch = () => {
      if (city) {
        weatherUpdate(city);
        setshowweatherdata(true)
      }
    }

    return (
      <>
        <div className="container flex items-center justify-center   w-[100%] min-h-[100vh] bg-black">
          <div className="box bg-custom h-[50vh] p-10 rounded-lg">
            <div className="flex gap-5 mb-10 justify-center items-center ">
              <input
                type="text"
                className="p-3 rounded-full px-10"
                placeholder="Enter City Name?"
                onChange={(e) => setCity(e.target.value)} 
              />
              <button onClick={handleSearch}><img
                className="bg-white p-35  size-10 rounded-full "
                src="/images/wired-outline-19-magnifier-zoom-search.png"
              /></button>
            </div>
            {showweatherdata && weatherData && (
              <>
            <div className="flex justify-center items-center">
              <img
                src={weatherIcon}
                width={200}
                className="text-center"
                alt=""
              />
            </div>
            
            
              <div className="text-white flex justify-center flex-c ol items-center gap-4">
              <h1 className="text-5xl font-bold">{weatherData.main.temp}°C</h1>
              <h2 className="text-3xl font-bold">{weatherData.name}</h2>
            </div>
            <div className="flex justify-center items-center gap-10 text-white">
              <div className="flex">
                <img src="/images/humidity_4148388.png" className="w-10" alt="" />
                <div className="flex flex-col">
                  <span>{weatherData.main.humidity}%</span>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="flex">
                <img src="/images/air_13923220.png" className="w-10" alt="" />
                <div className="flex flex-col">
                  <span>{weatherData.wind.speed}Km/h</span>
                  <span>Wind</span>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  export default App;
