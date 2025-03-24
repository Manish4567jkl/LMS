import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware setup (CORS is handled only here)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import authRoutes from "./routes/authRoutes.js";
import teacherRoutes from "./routes/teacher.route.js";
import courseRoutes from "./routes/course.route.js";
import studentRoutes from "./routes/student.js";

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/student", studentRoutes);

export default app;
