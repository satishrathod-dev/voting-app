import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const socket = io(apiUrl);

  useEffect(() => {
    fetchPolls();
    socket.on("updatePolls", (updatedPolls) => {
      setPolls(updatedPolls);
    });
    return () => socket.disconnect();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/polls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls(response.data);
    } catch (error) {
      console.error("Error fetching polls:", error.response?.data || error);
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Poll question and all options are required!");
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/api/polls`,
        { question, options },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestion("");
      setOptions(["", ""]);
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create poll!");
    }
  };

  const voteOnPoll = async (pollId, optionId) => {
    // Check if the user has already voted for this poll
    const votedPolls = JSON.parse(localStorage.getItem("votedPolls")) || [];
  
    if (votedPolls.includes(pollId)) {
      alert("You have already voted in this poll!");
      return;
    }
  
    try {
      await axios.post(
        `${apiUrl}/api/polls/${pollId}/vote`,
        { optionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Store the poll ID in local storage to prevent multiple votes
      localStorage.setItem("votedPolls", JSON.stringify([...votedPolls, pollId]));
  
      // Update the polls state manually
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll._id === pollId
            ? {
                ...poll,
                options: poll.options.map((opt) =>
                  opt._id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                ),
              }
            : poll
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to vote!");
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Available Polls</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Poll
        </button>
      </div>

      {/* Modal for Creating Poll */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create a Poll</h3>
            <form onSubmit={handleCreatePoll}>
              <input
                type="text"
                placeholder="Poll question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[idx] = e.target.value;
                      setOptions(newOptions);
                    }}
                    className="w-full p-2 border rounded"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() =>
                        setOptions(options.filter((_, i) => i !== idx))
                      }
                      className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setOptions([...options, ""])}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Add Option
              </button>
              <button
                type="submit"
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Poll
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Display Polls */}
      {polls.length === 0 ? (
        <p className="text-center text-gray-500">No polls available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce(
              (sum, option) => sum + option.votes,
              0
            );
            return (
              <div
                key={poll._id}
                className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  {poll.question}
                </h3>
                <ul>
                  {poll.options.map((option) => {
                    const percentage =
                      totalVotes > 0
                        ? ((option.votes / totalVotes) * 100).toFixed(1)
                        : 0;
                    return (
                      <li
                        key={option._id}
                        className="flex items-center justify-between mb-2"
                      >
                        <span>{option.text}</span>
                        <span>{`${option.votes} votes (${percentage}%)`}</span>
                        <button
                          onClick={() => voteOnPoll(poll._id, option._id)}
                          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                        >
                          Vote
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
