import Weather from "@/components/Weather";
import Crypto from "@/components/Crypto";
import News from "@/components/News"; // Import News Component

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      
      {/* Main Heading */}
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-10">
        CryptoWeather Nexus
      </h1>

      <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full max-w-[1600px] mx-auto items-stretch">
        
        {/* Weather Component - Left (1/5 Width) */}
        <div className="lg:col-span-1 p-6 bg-gray-800 rounded-lg shadow-lg w-full flex flex-col">
          <Weather />
        </div>
        
        {/* Crypto Component - Center (3/5 Width) */}
        <div className="lg:col-span-3 p-6 bg-gray-800 rounded-lg shadow-lg w-full flex flex-col">
          <Crypto />
        </div>
        
        {/* News Component - Right (1/5 Width) */}
        <div className="lg:col-span-1 p-6 bg-gray-800 rounded-lg shadow-lg w-full flex flex-col">
          <News />
        </div>

      </main>
    </div>
  );
}
