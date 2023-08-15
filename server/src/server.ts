import express from "express";
import session from "express-session";
import cors from "cors";
import { json } from "body-parser";
import routesRouter from "./routes";

const app = express();
const port = 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming request data as JSON
app.use(json());

// Set up express-session
app.use(
  session({
    secret: "abc123",
    resave: false,
    saveUninitialized: true,
  })
);

// Parse incoming request data as JSON
app.use(json());

// Set up API routes
app.use("/api", routesRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
