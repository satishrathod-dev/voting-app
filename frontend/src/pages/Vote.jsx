import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Vote = () => {
  const { pollId } = useParams(); // Get poll ID from URL
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL; // Load API URL from .env

  useEffect(() => {
    fetch(`${apiUrl}/api/polls/${pollId}`)
      .then((res) => res.json())
      .then((data) => setPoll(data))
      .catch((err) => console.error("Error fetching poll:", err));
  }, [pollId, apiUrl]);

  const navigate = useNavigate();

  const handleVote = async () => {
    if (!selectedOption) {
      setMessage("Please select an option before voting.");
      return;
    } else {
      navigate("/");
    }

    try {
      const response = await fetch(`${apiUrl}/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOption }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Vote submitted successfully!");
        setPoll((prevPoll) => ({
          ...prevPoll,
          options: prevPoll.options.map((option) =>
            option._id === selectedOption
              ? { ...option, votes: option.votes + 1 }
              : option
          ),
        }));
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error submitting vote. Please try again.");
    }
  };

  //  const handleVote = async () => {
  //     if (!selectedOption) {
  //       setMessage("Please select an option before voting.");
  //       return;
  //     } else {
  //       navigate("/");
  //     }

  //     // Check if user has already voted in this poll
  //     const votedPolls = JSON.parse(localStorage.getItem("votedPolls")) || [];

  //     if (votedPolls.includes(pollId)) {
  //       setMessage("❌ You have already voted in this poll.");
  //       return;
  //     }

  //     try {
  //       const response = await fetch(`${apiUrl}/api/polls/${pollId}/vote`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ optionId: selectedOption }),
  //       });

  //       const data = await response.json();
  //       if (response.ok) {
  //         setMessage("✅ Vote submitted successfully!");

  //         // Save poll ID in local storage to prevent multiple votes
  //         localStorage.setItem(
  //           "votedPolls",
  //           JSON.stringify([...votedPolls, pollId])
  //         );

  //         // Update poll results in UI
  //         setPoll((prevPoll) => ({
  //           ...prevPoll,
  //           options: prevPoll.options.map((option) =>
  //             option._id === selectedOption
  //               ? { ...option, votes: option.votes + 1 }
  //               : option
  //           ),
  //         }));
  //       } else {
  //         setMessage(`❌ ${data.message}`);
  //       }
  //     } catch (error) {
  //       setMessage("❌ Error submitting vote. Please try again.");
  //     }
  //   };

  if (!poll)
    return (
      <h2 className="text-center text-lg font-semibold">Loading poll...</h2>
    );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        {poll.question}
      </h2>
      <ul className="space-y-3">
        {poll.options.map((option) => (
          <li
            key={option._id}
            className="p-3 bg-gray-100 rounded-md flex justify-between items-center"
          >
            <label className="flex items-center space-x-3 w-full">
              <input
                type="radio"
                name="vote"
                value={option._id}
                onChange={() => setSelectedOption(option._id)}
                className="h-5 w-5 text-blue-500"
              />
              <span className="text-gray-700">{option.text}</span>
              <span className="ml-auto text-gray-500">
                {option.votes} votes
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleVote}
        className="w-full mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Submit Vote
      </button>
      {message && (
        <p
          className={`mt-3 text-center font-semibold ${
            message.includes("✅") ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Vote;
