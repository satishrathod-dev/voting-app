import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PollsList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/polls`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data); 
        setPolls(data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching polls:", err);
        setPolls([]); 
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading)
    return (
      <h2 className="text-center text-lg font-semibold">Loading polls...</h2>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Available Polls</h2>
      <ul className="space-y-4">
        {polls.map((poll) => {
          // Find the option with the highest votes
          const winner = poll.options.reduce(
            (max, option) => (option.votes > max.votes ? option : max),
            { text: "No votes", votes: 0 }
          );

          return (
            <li key={poll._id} className="p-4 bg-gray-100 rounded-md shadow">
              <h3 className="text-lg font-semibold text-blue-600">
                {poll.question}
              </h3>
              <p className="text-gray-500">
                Total Votes:{" "}
                {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}
              </p>
              <p className="font-semibold">
                Winning: {winner.text} ({winner.votes} votes)
              </p>
              <Link
                to={`/polls/${poll._id}`}
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Vote Now
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PollsList;
