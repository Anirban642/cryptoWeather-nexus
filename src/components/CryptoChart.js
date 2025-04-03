"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoChart = ({ coin }) => {
  const [prices, setPrices] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (!coin) return;

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin}@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newPrice = parseFloat(data.c).toFixed(2);
      const newTime = new Date().toLocaleTimeString();

      setPrices((prev) => (prev.length >= 20 ? [...prev.slice(1), newPrice] : [...prev, newPrice]));
      setLabels((prev) => (prev.length >= 20 ? [...prev.slice(1), newTime] : [...prev, newTime]));
    };

    return () => ws.close();
  }, [coin]);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${coin.toUpperCase().replace("USDT", "")} Price (USD)`,
        data: prices,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-white text-xl font-bold text-center mb-2">{coin.toUpperCase().replace("USDT", "")} Price Chart</h2>
      <Line data={chartData} />
    </div>
  );
};

export default CryptoChart;
