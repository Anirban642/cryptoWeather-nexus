"use client";
import Weather from "@components/Weather";
import Crypto from "@components/Crypto"; // Assume you already have Crypto.js
import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("weather");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">CryptoWeather Nexus</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "weather" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("weather")}
        >
          Weather
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "crypto" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("crypto")}
        >
          Crypto
        </button>
      </div>

      {activeTab === "weather" ? <Weather /> : <Crypto />}
    </div>
  );
}
