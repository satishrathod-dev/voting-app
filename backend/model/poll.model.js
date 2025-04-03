const mongoose = require("mongoose");
const crypto = require("crypto"); // For encryption

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  encryptedVoterIds: [String], // Store encrypted user IDs for anonymity
});

PollSchema.methods.encryptVoterId = function (voterId) {
  const secret = process.env.VOTE_SECRET || "default_secret_key";
  return crypto.createHmac("sha256", secret).update(voterId).digest("hex");
};

const Poll = mongoose.model("Poll", PollSchema);
module.exports = Poll;
