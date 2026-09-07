const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

require("./config/db");

const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");
const savedQuestionRoutes = require("./routes/savedQuestionRoutes");
const solvedQuestionRoutes = require("./routes/solvedQuestionRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const topicRoutes = require("./routes/topicRoutes");
const codeRoutes = require("./routes/codeRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/saved", savedQuestionRoutes);
app.use("/api/solved", solvedQuestionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/code", codeRoutes);

app.get("/", (req, res) => {
    res.send("DSA Platform API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on Port ${process.env.PORT}`);
});