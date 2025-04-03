"use client";
import { useEffect, useState } from "react";

const News = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY; // Access from env
        if (!apiKey) {
          throw new Error("Missing API Key");
        }

        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`
        );
        const data = await response.json();

        if (data.articles) {
          setNews(
            data.articles.slice(0, 5).map((article) => ({
              title: article.title,
              description: article.description
                ? article.description.split(".")[0] + "."
                : "No description available.",
              url: article.url,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching news:", error); // Log the error for debugging
        setError("Error fetching news");
      }
      
    };

    fetchNews();
  }, []);

  if (error) return <p className="text-red-500">Error loading news</p>;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📰 Latest News</h2>
      <div className="space-y-6">
        {news.map((article, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{article.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-400 hover:underline text-sm"
            >
              Read More →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
