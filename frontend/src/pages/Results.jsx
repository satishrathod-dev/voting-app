import React, { useEffect, useState } from "react";
import axios from "axios";

const Results = ({ pollId }) => {
  const [results, setResults] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResults();
  }, [pollId]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/polls/${pollId}/results`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error.response?.data || error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Poll Results</h2>
      {results ? (
        <ul>
          {results.options.map((option) => (
            <li key={option.text} className="mb-2">
              {option.text} - {option.votes} votes ({option.percentage})
              {option.text === results.winner.text && (
                <strong> (Winning)</strong>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Results;
