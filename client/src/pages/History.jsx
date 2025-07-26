import React, { useEffect, useState } from "react";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
  const token = localStorage.getItem("token"); // Auth token

//   useEffect(() => {
//     const fetchHistory = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE_URL}/history`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.detail || "Failed to fetch history");
//         }

//         const data = await res.json();
//         setHistory(data.reverse());
//       } catch (err) {
//         console.error("History fetch error:", err);
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [token]);

useEffect(() => {
  const mockHistory = [
    {
      id: 1,
      query: "laptop",
      platforms: ["amazon", "ebay"],
      total_results: 23,
      timestamp: "2025-07-25T10:30:00Z"
    },
    {
      id: 2,
      query: "smartphone",
      platforms: ["walmart"],
      total_results: 15,
      timestamp: "2025-07-24T14:15:00Z"
    },
    {
      id: 3,
      query: "gaming keyboard",
      platforms: ["shopify", "amazon", "ebay"],
      total_results: 42,
      timestamp: "2025-07-22T09:45:00Z"
    },
    {
      id: 4,
      query: "headphones",
      platforms: ["ebay"],
      total_results: 8,
      timestamp: "2025-07-20T18:10:00Z"
    }
  ];

  setHistory(mockHistory);
  setLoading(false);
}, []);



  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete history entry");
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete entry.");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete all history?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to clear history");
      setHistory([]);
    } catch (err) {
      console.error("Clear error:", err);
      setError("Failed to clear history.");
    }
  };

  const handleRepeatSearch = (query, platforms) => {
    const url = `/search?query=${encodeURIComponent(query)}&platforms=${platforms.join(",")}`;
    navigate(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Your Search History</h1>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : history.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            You haven't made any searches yet.
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <Trash2 size={16} /> Clear All History
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border">
                <thead className="bg-gray-100">
                  <tr className="text-left text-sm text-gray-700">
                    <th className="p-3">Query</th>
                    <th className="p-3">Platforms</th>
                    <th className="p-3">Results</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="border-t text-sm">
                      <td className="p-3">{entry.query}</td>
                      <td className="p-3">{entry.platforms.join(", ")}</td>
                      <td className="p-3">{entry.total_results}</td>
                      <td className="p-3">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() =>
                            handleRepeatSearch(entry.query, entry.platforms)
                          }
                          className="text-blue-600 hover:underline text-xs"
                        >
                          <RotateCcw size={14} className="inline-block mr-1" />
                          Search Again
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          <Trash2 size={14} className="inline-block mr-1" />
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
