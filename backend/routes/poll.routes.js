const express = require("express");
const { authuser } = require("../middlewares/auth.middleware");
const router = express.Router();
const Poll = require("../model/poll.model");

// Create a new poll
router.post("/polls", authuser, async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || options.length < 2) {
      return res
        .status(400)
        .json({ message: "Provide a question & at least 2 options." });
    }

    const formattedOptions = options.map((option) => ({
      text: option,
      votes: 0,
    }));

    const newPoll = new Poll({
      question,
      options: formattedOptions,
      createdBy: req.user.id,
    });

    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// get all polls
router.get("/polls", async (req, res) => {
  try {
    const polls = await Poll.find();
    console.log("polls", polls);

    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Vote on a poll
// router.post("/polls/:pollId/vote", async (req, res) => {
//   try {
//     const { optionId } = req.body;
//     const { pollId } = req.params;
//     const userId = req.user.id; // Logged-in user

//     if (!optionId) {
//       return res.status(400).json({ message: "Option ID is required." });
//     }

//     const poll = await Poll.findById(pollId);
//     if (!poll) {
//       return res.status(404).json({ message: "Poll not found." });
//     }

//     const encryptedVoterId = poll.encryptVoterId(userId);

//     if (poll.encryptedVoterIds.includes(encryptedVoterId)) {
//       return res.status(403).json({ message: "You have already voted!" });
//     }

//     // Add the encrypted voter ID & increase votes
//     poll.encryptedVoterIds.push(encryptedVoterId);
//     const option = poll.options.id(optionId);
//     option.votes += 1;

//     await poll.save();
//     res.status(200).json({ message: "Vote cast successfully!", poll });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

// // Get a single poll by ID
router.get("/polls/:pollId", async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// // agreegation of results
// router.get("/polls/:pollId/results", async (req, res) => {
//   try {
//     const { pollId } = req.params;
//     const poll = await Poll.findById(pollId);
//     if (!poll) {
//       return res.status(404).json({ message: "Poll not found." });
//     }

//     const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

//     let optionsWithPercentages = poll.options.map((opt) => {
//       const fakeVotes = Math.round(
//         opt.votes * (1 + (Math.random() * 0.1 - 0.05))
//       ); // ±5% votes
//       return {
//         text: opt.text,
//         votes: fakeVotes,
//         percentage: totalVotes
//           ? ((fakeVotes / totalVotes) * 100).toFixed(2) + "%"
//           : "0%",
//       };
//     });

//     const winner = optionsWithPercentages.reduce(
//       (max, opt) => (opt.votes > max.votes ? opt : max),
//       optionsWithPercentages[0]
//     );

//     res
//       .status(200)
//       .json({ totalVotes, options: optionsWithPercentages, winner });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

router.get("/polls/votes", async (req, res) => {
  try {
    const polls = await Poll.find({}); // Fetch all polls
    console.log("polls", polls);

    if (!polls.length) {
      return res.status(404).json({ message: "No polls found." });
    }

    const formattedPolls = polls.map((poll) => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

      const optionsWithPercentages = poll.options.map((opt) => {
        const fakeVotes = Math.round(
          opt.votes * (1 + (Math.random() * 0.1 - 0.05))
        ); // ±5% variation
        return {
          text: opt.text,
          votes: fakeVotes,
          percentage: totalVotes
            ? ((fakeVotes / totalVotes) * 100).toFixed(2) + "%"
            : "0%",
        };
      });

      const winner = optionsWithPercentages.reduce(
        (max, opt) => (opt.votes > max.votes ? opt : max),
        optionsWithPercentages[0]
      );

      return {
        pollId: poll._id,
        question: poll.question,
        totalVotes,
        options: optionsWithPercentages,
        winner,
      };
    });

    res.status(200).json({ polls: formattedPolls });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Public Vote Endpoint (Anonymous Voting)
router.post("/polls/:pollId/vote", async (req, res) => {
  try {
    const { optionId } = req.body;
    const { pollId } = req.params;

    if (!optionId) {
      return res.status(400).json({ message: "Option ID is required." });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    // Increase votes anonymously
    const option = poll.options.id(optionId);
    option.votes += 1;

    await poll.save();
    res.status(200).json({ message: "Vote cast successfully!", poll });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
