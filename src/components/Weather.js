"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData } from "@/redux/slices/weatherSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Weather = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.weather);
  const [city, setCity] = useState("");
  const [favoriteCity, setFavoriteCity] = useState(null); // ✅ Only ONE favorite city
  const [lastSearchedCity, setLastSearchedCity] = useState(null); // ✅ Track last searched city

  // Fetch initial cities
  useEffect(() => {
    dispatch(fetchWeatherData("New York"));
    dispatch(fetchWeatherData("London"));
    dispatch(fetchWeatherData("Tokyo"));
  }, [dispatch]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      setLastSearchedCity(city.trim()); // ✅ Latest searched city replaces 4th position
      dispatch(fetchWeatherData(city.trim()));
      toast.info(`🔍 Searching for weather in ${city.trim()}...`);
      setCity("");
    }
  };

  // Toggle favorite city
  const toggleFavorite = (cityName) => {
    if (favoriteCity === cityName) {
      setFavoriteCity(null); // ✅ Remove favorite if clicked again
      toast.warn(`❌ Removed ${cityName} from favorites`);
    } else {
      setFavoriteCity(cityName); // ✅ Set new favorite
      toast.success(`⭐ ${cityName} is now your favorite`);
    }
  };

  // Maintain the order of cities (Favorite at top, others below)
  const fixedCities = ["New York", "London", "Tokyo"];
  let sortedCities = [...fixedCities];

  if (lastSearchedCity) {
    sortedCities[3] = lastSearchedCity; // ✅ Keep latest search in 4th position
  }

  // Move favorite city to the top if exists
  if (favoriteCity && sortedCities.includes(favoriteCity)) {
    sortedCities = [favoriteCity, ...sortedCities.filter((city) => city !== favoriteCity)];
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🌍 Live Weather</h2>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="flex w-full mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City..."
          className="p-2 w-full rounded-l bg-gray-700 text-white outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-700">
          🔍
        </button>
      </form>

      {loading && <p className="text-center text-yellow-400">Fetching latest weather data...</p>}

      {/* Weather Cards */}
      <div className="space-y-4">
        {sortedCities.map((cityName) => {
          const weather = data[cityName]?.weather?.[0];
          if (!weather) return null;
          const wind = data[cityName].wind;

          return (
            <div key={cityName} className="p-6 bg-gray-800 rounded-lg shadow-md relative">
              <h3 className="text-xl font-semibold">{cityName}</h3>
              <p className="text-4xl mt-2">☀️</p>
              <p className="text-3xl font-bold mt-2">{data[cityName].main.temp}°C</p>
              <p className="text-gray-400">💧 Humidity: {data[cityName].main.humidity}%</p>
              <p className="text-gray-400">💨 Wind: {wind.speed} m/s</p>

              {/* Favorite Button (Only 1 favorite at a time) */}
              <button
                onClick={() => toggleFavorite(cityName)}
                className={`absolute top-2 right-2 px-3 py-1 rounded ${
                  favoriteCity === cityName ? "bg-yellow-500 text-white" : "bg-gray-600 text-yellow-300"
                }`}
              >
                {favoriteCity === cityName ? "⭐" : "☆"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Weather;
