import React, { useEffect, useState } from "react";
import { Trash2, RotateCcw, Loader2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!token;

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    fetchHistory();
  }, [token, isLoggedIn]);

  const fetchHistory = async () => {
    setLoading(true);
    console.log("Fetching search history...");
    try {
      const res = await fetch(`${API_BASE_URL}/search-history/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response Status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error fetching history:", errorData);
        throw new Error(errorData.detail || "Failed to fetch history");
      }

      const data = await res.json();
      console.log("Fetched data:", data);
      setHistory(data); // Show newest first
    } catch (err) {
      console.error("History fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isLoggedIn) return;

    console.log(`Deleting search history entry with id: ${id}`);
    try {
      const res = await fetch(`${API_BASE_URL}/search-history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete history entry");
      setHistory((prev) => prev.filter((item) => item.id !== id));
      console.log(`Deleted entry with id: ${id}`);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete entry.");
    }
  };

  const handleClearAll = async () => {
    if (!isLoggedIn) return;
    if (!confirm("Are you sure you want to delete all history?")) return;

    console.log("Clearing all search history...");
    try {
      const res = await fetch(`${API_BASE_URL}/search-history/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to clear history");
      setHistory([]);
      console.log("All search history cleared.");
    } catch (err) {
      console.error("Clear error:", err);
      setError("Failed to clear history.");
    }
  };

  const handleRepeatSearch = (query, platforms) => {
    const url = `/search?query=${encodeURIComponent(query)}&platforms=${platforms.join(",")}`;
    console.log(`Repeating search with query: "${query}" and platforms: ${platforms.join(", ")}`);
    navigate(url);
  };

  const handleLogin = () => {
    console.log("Redirecting to login page...");
    navigate("/login");
  };

  // Not logged in view
  if (!isLoggedIn) {
    return (
<div className="min-h-screen px-4 py-6" style={{backgroundColor: '#E5F3FD'}}>
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center py-12">
            <Lock className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Login Required
            </h2>
            <p className="text-gray-500 mb-6">
              You need to be logged in to view your search history.
            </p>
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
<div className="min-h-screen px-4 py-6" style={{backgroundColor: '#E5F3FD'}}>
<div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Your Search History</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded mb-4">
            {error}
            <button 
              onClick={() => setError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : history.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            <p className="mb-2">You haven't made any searches yet.</p>
            <button
              onClick={() => navigate("/search")}
              className="text-blue-600 hover:underline"
            >
              Start searching now
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {history.length} search{history.length !== 1 ? 'es' : ''} found
              </p>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={16} /> Clear All History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr className="text-left text-sm text-gray-700">
                    <th className="p-3 font-medium">Query</th>
                    <th className="p-3 font-medium">Platforms</th>
                    <th className="p-3 font-medium">Results</th>
                    <th className="p-3 font-medium">Date</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <tr 
                      key={entry.id} 
                      className={`border-t text-sm ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="p-3 font-medium">{entry.query}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {entry.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded capitalize"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          {entry.total_results} items
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() =>
                            handleRepeatSearch(entry.query, entry.platforms)
                          }
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 mb-1"
                        >
                          <RotateCcw size={14} />
                          Search Again
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HistoryPage;
