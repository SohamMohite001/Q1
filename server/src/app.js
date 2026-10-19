import express from "express";
import cors from "cors";
import faqRoutes from "./routes/faq.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/error-handler.js";

const app = express();

// Security and CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({
  origin: corsOrigin === "*" ? true : corsOrigin,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Request body size limit to prevent resource exhaustion
app.use(express.json({ limit: "16kb" }));

// Mount API routes
app.use("/api", faqRoutes);

// Catch unknown routes (404)
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export default app;
