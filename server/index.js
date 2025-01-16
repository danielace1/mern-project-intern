import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./lib/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import notificationRoutes from "./routes/notification.route.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://mern-project-intern-client.vercel.app",
    ],
  })
);

app.use(cookieParser());
app.use(
  express.json({
    limit: "30mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notification", notificationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
    auth: "/api/auth",
    posts: "/api/posts",
    users: "/api/users",
    notification: "/api/notification",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to the database.");
  }
};

startServer();
