"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData } from "@/redux/slices/weatherSlice";

const getWeatherIcon = (description) => {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("clear")) return "☀️";
  if (lowerDesc.includes("cloud")) return "⛅";
  if (lowerDesc.includes("rain")) return "🌧️";
  if (lowerDesc.includes("thunderstorm")) return "⛈️";
  if (lowerDesc.includes("snow")) return "❄️";
  return "🌫️";
};

const getWindDirection = (deg) => {
  if (deg >= 337.5 || deg < 22.5) return "⬆️ N";
  if (deg >= 22.5 && deg < 67.5) return "↗️ NE";
  if (deg >= 67.5 && deg < 112.5) return "➡️ E";
  if (deg >= 112.5 && deg < 157.5) return "↘️ SE";
  if (deg >= 157.5 && deg < 202.5) return "⬇️ S";
  if (deg >= 202.5 && deg < 247.5) return "↙️ SW";
  if (deg >= 247.5 && deg < 292.5) return "⬅️ W";
  if (deg >= 292.5 && deg < 337.5) return "↖️ NW";
  return "❓";
};

const Weather = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.weather);
  const [city, setCity] = useState("");
  const [favorites, setFavorites] = useState(null); // Store the single favorite city

  useEffect(() => {
    dispatch(fetchWeatherData("New York"));
    dispatch(fetchWeatherData("London"));
    dispatch(fetchWeatherData("Tokyo"));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      dispatch(fetchWeatherData(city.trim()));
      setCity("");
    }
  };

  const toggleFavorite = (city) => {
    setFavorites((prevFavorite) => (prevFavorite === city ? null : city));
  };

  const sortedCities = Object.keys(data);
  if (favorites && sortedCities.includes(favorites)) {
    sortedCities.splice(sortedCities.indexOf(favorites), 1);
    sortedCities.unshift(favorites);
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">🌍 Live Weather</h2>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="flex w-full mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City..."
          className="p-2 w-2.5 flex-grow rounded-l bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-700"
        >
          🔍
        </button>
      </form>

      {loading && <p className="text-center text-yellow-400">Fetching latest weather data...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="space-y-4 w-full">
        {sortedCities.map((city) => {
          const weather = data[city].weather[0];
          const wind = data[city].wind;
          return (
            <div key={city} className="relative p-6 bg-gray-800 rounded-2xl shadow-md flex flex-col items-center w-full">
              {/* Favorite Button (Top Right) */}
              <button
                onClick={() => toggleFavorite(city)}
                className="absolute top-2 right-2 text-2xl"
              >
                {favorites === city ? "❤️" : "🤍"}
              </button>

              <h3 className="text-xl font-semibold">{city}</h3>
              <p className="text-4xl mt-2">{getWeatherIcon(weather.description)}</p>
              <p className="text-3xl font-bold mt-2">{data[city].main.temp}°C</p>
              {/* <p className="mt-1 text-lg">🌥️ {weather.description}</p> */}
              <div className="mt-4 text-sm flex flex-col items-center gap-1">
                <p className="text-gray-400">⬇️ Min: <span className="text-white">{data[city].main.temp_min}°C</span></p>
                <p className="text-gray-400">⬆️ Max: <span className="text-white">{data[city].main.temp_max}°C</span></p>
                <p className="text-gray-400">💧 Humidity: <span className="text-white">{data[city].main.humidity}%</span></p>
                <p className="text-gray-400">💨 Wind: <span className="text-white">{wind.speed} m/s {getWindDirection(wind.deg)}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Weather;
