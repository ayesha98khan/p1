require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const jobRoutes = require("./src/routes/jobs");
const applicationRoutes = require("./src/routes/applications");
const storyRoutes = require("./src/routes/stories");
const uploadRoutes = require("./src/routes/upload");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = Number(process.env.PORT || 5000);

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`✅ Backend: http://localhost:${PORT}`));
})();