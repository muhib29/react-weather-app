import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Droplets, Wind, Eye, Thermometer, Sunrise, Sunset } from "lucide-react";
import { gsap } from "gsap";

// API Configuration
const API_KEY = "9893be2ddd99bcd30677a2ef918cac79";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const App = () => {
  // State management
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  // Refs for animations
  const weatherCardRef = useRef(null);
  const searchRef = useRef(null);
  const detailsRef = useRef(null);

  // Weather icon mapping
  const getWeatherIcon = (weatherMain) => {
    const iconMap = {
      "Clouds": "/images/cloudy.png",
      "Clear": "/images/clear.png",
      "Rain": "/images/rainy.png",
      "Snow": "/images/snow.png",
      "Drizzle": "/images/drizle.png",
      "Mist": "/images/mist.png",
      "Fog": "/images/mist.png",
      "Haze": "/images/mist.png",
    };
    return iconMap[weatherMain] || "/images/clear.png";
  };

  // Format time from timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Fetch weather data
  const fetchWeatherData = async (cityName) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_URL}${cityName}&appid=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error("City not found. Please try another city.");
      }
      
      const data = await response.json();
      setWeatherData(data);
      
      // Add to search history
      if (!searchHistory.includes(cityName)) {
        setSearchHistory(prev => [cityName, ...prev.slice(0, 4)]);
      }
      
      // Animate elements
      animateWeatherCard();
      
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Animation functions
  const animateWeatherCard = () => {
    const tl = gsap.timeline();
    
    tl.fromTo(weatherCardRef.current, 
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    )
    .fromTo(detailsRef.current?.children || [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      "-=0.3"
    );
  };

  const animateSearch = () => {
    gsap.fromTo(searchRef.current,
      { scale: 0.95, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  };

  // Handle search
  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
      animateSearch();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Load default city on mount
  useEffect(() => {
    fetchWeatherData("Bishops Stortford");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-weather-blue via-weather-light-blue to-blue-400 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Weather App
          </h1>
          <p className="text-white/80 text-lg md:text-xl">
            Discover the weather anywhere in the world
          </p>
        </div>

        {/* Search Section */}
        <div ref={searchRef} className="max-w-md mx-auto mb-8 animate-slide-up">
          <div className="relative">
            <div className="flex items-center bg-white/20 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/30">
              <Search className="w-6 h-6 text-white/70 ml-4" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name..."
                className="flex-1 bg-transparent text-white placeholder-white/60 px-4 py-3 outline-none text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 transition-all duration-300 rounded-xl p-3 mr-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {searchHistory.map((historyCity, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCity(historyCity);
                    fetchWeatherData(historyCity);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white px-3 py-1 rounded-full text-sm transition-all duration-300 backdrop-blur-sm"
                >
                  {historyCity}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 animate-scale-in">
            <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl backdrop-blur-md">
              {error}
            </div>
          </div>
        )}

        {/* Weather Card */}
        {weatherData && (
          <div ref={weatherCardRef} className="max-w-4xl mx-auto w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
              
              {/* Main Weather Info */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white/80 mr-2" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                </div>
                
                <div className="flex items-center justify-center mb-6">
                  <img
                    src={getWeatherIcon(weatherData.weather[0].main)}
                    alt={weatherData.weather[0].description}
                    className="w-24 h-24 md:w-32 md:h-32 animate-float"
                  />
                </div>
                
                <div className="mb-4">
                  <h3 className="text-6xl md:text-8xl font-bold text-white mb-2">
                    {Math.round(weatherData.main.temp)}°C
                  </h3>
                  <p className="text-xl md:text-2xl text-white/80 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
                
                <div className="text-white/70 text-lg">
                  Feels like {Math.round(weatherData.main.feels_like)}°C
                </div>
              </div>

              {/* Weather Details */}
              <div ref={detailsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                
                {/* Humidity */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <Droplets className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{weatherData.main.humidity}%</div>
                  <div className="text-white/70 text-sm">Humidity</div>
                </div>

                {/* Wind Speed */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <Wind className="w-8 h-8 text-green-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{weatherData.wind.speed} m/s</div>
                  <div className="text-white/70 text-sm">Wind Speed</div>
                </div>

                {/* Visibility */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <Eye className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : 'N/A'} km
                  </div>
                  <div className="text-white/70 text-sm">Visibility</div>
                </div>

                {/* Pressure */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <Thermometer className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{weatherData.main.pressure} hPa</div>
                  <div className="text-white/70 text-sm">Pressure</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <Sunrise className="w-5 h-5 mr-2 text-yellow-300" />
                    Sunrise & Sunset
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80">
                      <span>Sunrise:</span>
                      <span>{formatTime(weatherData.sys.sunrise)}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Sunset:</span>
                      <span>{formatTime(weatherData.sys.sunset)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h4 className="text-white font-semibold mb-4">Temperature Range</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-white/80">
                      <span>Min:</span>
                      <span>{Math.round(weatherData.main.temp_min)}°C</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Max:</span>
                      <span>{Math.round(weatherData.main.temp_max)}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
