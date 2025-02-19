import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware setup
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // Allows cookies and authentication headers
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import authRoutes from "./routes/authRoutes.js";
import teacherRoutes from "./routes/teacher.route.js";
import courseRoutes from "./routes/course.route.js";
import studentRoutes from "./routes/student.js";

// Routes Declaration
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/student", studentRoutes);

// Default route for testing if server is running
app.get("/", (req, res) => {
  res.send("LMS Backend is running 🚀");
});

// Export the app object for server setup
export default app;
