import express from "express";
import session from "express-session";
import userRoutes from "./users";
import cors from "cors";
import { json } from "body-parser";
import routesRouter from "./routes";
import { UserAccount } from "database";
import { verifyPassword } from "./auth";
import db from "./db";

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

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the 'users' table
  const user: UserAccount = await new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, row: any) => {
        if (err) reject(err);
        resolve(row);
      }
    );
  });

  if (user && (await verifyPassword(password, user.password_hash))) {
    // Set isAuthenticated flag in the session
    req.session.authenticated = true;
    req.session.user = user;

    res.json({ ok: true, message: "Login successful" });

    return;
  }

  // Default deny
  res.status(401).json({ error: "Invalid username or password" });
});

app.use("/api/users", userRoutes);

// Set up API routes
app.use("/api", routesRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
