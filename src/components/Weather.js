"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData } from "@/redux/slices/weatherSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Weather = () => {
  const dispatch = useDispatch();
  const { data, loading} = useSelector((state) => state.weather);
  const [city, setCity] = useState("");
  const [lastSearchedCity, setLastSearchedCity] = useState(null); // ✅ Track last searched city

  // Fetch fixed initial cities
  useEffect(() => {
    dispatch(fetchWeatherData("New York"));
    dispatch(fetchWeatherData("London"));
    dispatch(fetchWeatherData("Tokyo"));
  }, [dispatch]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      setLastSearchedCity(city.trim()); // ✅ Update last searched city
      dispatch(fetchWeatherData(city.trim()));
      toast.info(`🔍 Searching for weather in ${city.trim()}...`);
      setCity("");
    }
  };

  // ✅ Ensure only 4 cities exist (First 3 fixed, Last one is the searched city)
  const fixedCities = ["New York", "London", "Tokyo"];
  const sortedCities = [...fixedCities];

  if (lastSearchedCity) {
    sortedCities.push(lastSearchedCity); // Add last searched city at position 4
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

      <div className="space-y-4 w-full">
        {sortedCities.map((city) => {
          const weather = data[city]?.weather?.[0];
          if (!weather) return null; // Prevents errors
          const wind = data[city].wind;

          return (
            <div key={city} className="relative p-6 bg-gray-800 rounded-2xl shadow-md flex flex-col items-center w-full">
              <h3 className="text-xl font-semibold">{city}</h3>
              <p className="text-4xl mt-2">☀️</p>
              <p className="text-3xl font-bold mt-2">{data[city].main.temp}°C</p>
              <p className="text-gray-400">💧 Humidity: {data[city].main.humidity}%</p>
              <p className="text-gray-400">💨 Wind: {wind.speed} m/s</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Weather;
