require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

/* =========================
   DB CONNECT
========================= */
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) throw new Error("Missing MONGODB_URI in .env");
  if (!dbName) throw new Error("Missing MONGODB_DB in .env");

  await mongoose.connect(uri, { dbName });
  console.log("✅ MongoDB connected");
}

/* =========================
   ROUTES (YOUR FOLDER IS src/routes)
========================= */
const authRoutes = require("./src/routes/auth");
const jobRoutes = require("./src/routes/jobs");
const userRoutes = require("./src/routes/users");
const uploadRoutes = require("./src/routes/upload");
const storyRoutes = require("./src/routes/stories");
const taskRoutes = require("./src/routes/tasks");
const applicationRoutes = require("./src/routes/applications");

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Mount
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/applications", applicationRoutes);

/* =========================
   OPTIONAL: JIRA ROUTE (only if file exists)
   Create it later at: backend/src/routes/jira.js
========================= */
const jiraPath = path.join(__dirname, "src", "routes", "jira.js");
if (fs.existsSync(jiraPath)) {
  const jiraRoutes = require("./src/routes/jira");
  app.use("/api/jira", jiraRoutes);
  console.log("✅ Jira routes enabled");
} else {
  console.log("ℹ️ Jira routes not found yet (src/routes/jira.js). Skipping...");
}

/* =========================
   404 + ERROR HANDLER
========================= */
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

/* =========================
   START
========================= */
const PORT = Number(process.env.PORT || 5000);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  } catch (e) {
    console.error("❌ Failed to start server:", e.message);
    process.exit(1);
  }
})();