import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./lib/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(
  express.json({
    limit: "30mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port http://localhost:" + PORT);
});
