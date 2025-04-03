"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dynamically import TradingViewWidget to prevent SSR issues
const TradingViewWidget = dynamic(() => import("./TradingViewWidget"), { ssr: false });

const Crypto = () => {
  const defaultCoins = ["btcusdt", "ethusdt", "dogeusdt"];
  const [cryptoData, setCryptoData] = useState({});
  const [error, setError] = useState(null);
  const [searchedCoin, setSearchedCoin] = useState(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const coinsToFetch = searchedCoin ? [...defaultCoins, searchedCoin] : defaultCoins;
    const wsConnections = coinsToFetch.map((c) => {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${c}@ticker`);

      ws.onopen = () => toast.success(`✅ Connected to ${c.toUpperCase()} WebSocket`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setCryptoData((prevData) => ({
          ...prevData,
          [c]: {
            price: parseFloat(data.c).toFixed(2),
            change: parseFloat(data.p).toFixed(2),
            changePercent: parseFloat(data.P).toFixed(2),
            high: parseFloat(data.h).toFixed(2),
            low: parseFloat(data.l).toFixed(2),
          },
        }));
      };

      ws.onerror = () => {
        setError("WebSocket Error");
        toast.error(`❌ Error connecting to ${c.toUpperCase()} WebSocket`);
      };

      ws.onclose = () => toast.warn(`⚠️ Disconnected from ${c.toUpperCase()} WebSocket`);
      return ws;
    });

    return () => wsConnections.forEach((ws) => ws.close());
  }, [searchedCoin]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      setSearchedCoin(search.toLowerCase() + "usdt");
      setSearch("");
      toast.info(`🔍 Searching for ${search.toUpperCase()}`);
    }
  };

  const toggleFavorite = (coin) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(coin)
        ? prevFavorites.filter((fav) => fav !== coin)
        : [coin, ...prevFavorites]
    );
    toast.success(
      favorites.includes(coin)
        ? `❌ Removed ${coin.toUpperCase()} from favorites`
        : `⭐ Added ${coin.toUpperCase()} to favorites`
    );
  };

  if (error) return <p className="text-red-500 text-center">⚠️ Error fetching crypto data</p>;

  const allCoins = [...favorites, ...(searchedCoin ? [...defaultCoins, searchedCoin] : defaultCoins).filter(c => !favorites.includes(c))];

  return (
    <div className="flex flex-col items-center w-full p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
        Live Cryptocurrency Prices
      </h1>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="flex mb-6 w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter Crypto Symbol (e.g., BTC)"
          className="p-2 w-2.5 flex-grow rounded-l bg-gray-200 text-gray-800 outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-700">
          🔍
        </button>
      </form>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* Crypto Prices */}
        <div className="flex flex-col gap-6 w-full">
          {allCoins.map((c) => (
            <div
              key={c}
              className="relative p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-lg flex flex-col items-center w-full sm:h-[250px] h-auto"
            >
              <button onClick={() => toggleFavorite(c)} className="absolute top-2 right-2 text-2xl">
                {favorites.includes(c) ? "❤️" : "🤍"}
              </button>

              <h2 className="text-lg sm:text-2xl font-bold">{c.toUpperCase().replace("USDT", "")}/USD</h2>
              {cryptoData[c]?.price ? (
                <>
                  <p className="text-xl sm:text-3xl font-semibold mt-2">${cryptoData[c].price}</p>
                  <p className={`mt-1 text-md sm:text-lg font-medium ${cryptoData[c].change > 0 ? "text-green-400" : "text-red-400"}`}>
                    {cryptoData[c].change > 0 ? "🔼" : "🔽"} ${cryptoData[c].change} ({cryptoData[c].changePercent}%)
                  </p>
                  <div className="mt-4 text-xs sm:text-sm flex flex-col gap-1">
                    <p className="text-gray-400">24h High: <span className="text-white">${cryptoData[c].high}</span></p>
                    <p className="text-gray-400">24h Low: <span className="text-white">${cryptoData[c].low}</span></p>
                  </div>
                </>
              ) : (
                <p className="animate-pulse">Fetching live price...</p>
              )}
            </div>
          ))}
        </div>

        {/* Crypto Charts */}
        <div className="flex flex-col gap-6 w-full">
          {allCoins.map((c) => (
            <div key={c} className="p-3 bg-gray-900 rounded-lg shadow-md w-full sm:h-[250px] h-auto flex flex-col">
              <h3 className="text-md sm:text-lg text-white text-center">{c.toUpperCase().replace("USDT", "")} Chart</h3>
              <div className="w-full h-full overflow-hidden">
                <TradingViewWidget symbol={c.toUpperCase()} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Crypto;
