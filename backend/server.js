const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();

const app = express();
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);
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
const solutionRoutes = require("./routes/solutionRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const adminInterviewRoutes = require("./routes/adminInterviewRoutes");
const noteRoutes = require("./routes/noteRoutes");
const adminNoteRoutes =
    require("./routes/adminNoteRoutes");
const contactRoutes = require("./routes/contactRoutes");
const profileRoutes = require("./routes/profileRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/saved", savedQuestionRoutes);
app.use("/api/solved", solvedQuestionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/interviews",interviewRoutes);
app.use(
    "/api/admin/interviews",
    adminInterviewRoutes
);
app.use("/api/notes",noteRoutes);
app.use(
    "/api/admin/notes",
    adminNoteRoutes
);

app.use("/api/contact", contactRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.send("DSA Platform API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on Port ${process.env.PORT}`);
});