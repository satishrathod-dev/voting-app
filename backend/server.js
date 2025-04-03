const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");
const express = require("express");
const app = express();
const connectDB = require("./db/db")
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes")
const pollRoutes = require("./routes/poll.routes")


connectDB()

app.use(cors());

// app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use("/api", userRoutes)
app.use("/api", pollRoutes);


const PORT = process.env.PORT || 8000


app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT)
})