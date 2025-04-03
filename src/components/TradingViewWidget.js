import { useEffect, useRef } from "react";

const TradingViewWidget = ({ symbol }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `BINANCE:${symbol}`,
      width: "100%",
      height: 200,
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      trendLineColor: "rgba(41, 98, 255, 1)",
      underLineColor: "rgba(41, 98, 255, 0.3)",
      isTransparent: false,
      autosize: true,
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div ref={containerRef} className="tradingview-widget-container w-full h-52"></div>
  );
};

export default TradingViewWidget;
