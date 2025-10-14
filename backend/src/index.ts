import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";

// Initialize Cloudinary for image/file uploads
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB database using Mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// Get the MongoDB connection object to listen for events
const db = mongoose.connection;

// MongoDB connection events
// Event listener for MongoDB connection success
db.on("connected", () => {
  console.log("MongoDB connected successfully!");  // Logs when the connection is successful
});

// Event listener for MongoDB connection errors
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);  // Logs if any error occurs during connection
});

// Event listener for MongoDB disconnection
db.on("disconnected", () => {
  console.log("MongoDB disconnected");  // Logs when the connection is lost or closed
});


// Initialize Express app
const app = express();


// Middleware setup
app.use(cookieParser());
app.use(express.json()); // Middleware to parse incoming JSON data in requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data (e.g., form data)
// Middleware to handle CORS (Cross-Origin Resource Sharing)
// This allows the frontend to communicate with the backend
app.use( 
  cors({
    origin: process.env.FRONTEND_URL,  // Allowed frontend URL
    credentials: true,  // Allow credentials (cookies, etc.) to be included
  })
);


// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "../../frontend/dist")));


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);


// Fallback for frontend routing (SPA) (Single Page Application)
// If a request does not match any of the API routes above, this route will return index.html 
// for client-side routing to take over (useful for React, Vue, etc.)
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


module.exports = app;
