import { Request, Response } from "express";
import { hashString, verifyPassword } from "./auth"; // Import your hashString and verifyPassword functions
import db from "./db"; // Import your database connection
import { Router } from "express";
import { UserAccount } from "database";

const app = Router();

// Create a user account
app.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password, access_type, umpire_id } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await hashString(password);

    // Insert the new user account into the 'user_accounts' table
    db.run(
      "INSERT INTO user_accounts (username, password_hash, access_type, umpire_id) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, access_type, umpire_id]
    );

    res.json({ message: "User account created successfully" });
  } catch (error) {
    console.error("Error creating user account:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user account" });
  }
});

// Read a user account
app.get("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = db.get("SELECT * FROM user_accounts WHERE id = ?", [userId]);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User account not found" });
    }
  } catch (error) {
    console.error("Error reading user account:", error);
    res
      .status(500)
      .json({ error: "An error occurred while reading the user account" });
  }
});

// Update a user account
app.put("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { password, access_type, umpire_id } = req.body;

  try {
    // Hash the new password before updating it in the database
    const hashedPassword = await hashString(password);

    db.run(
      "UPDATE user_accounts SET password_hash = ?, access_type = ?, umpire_id = ? WHERE id = ?",
      [hashedPassword, access_type, umpire_id, userId]
    );

    res.json({ message: "User account updated successfully" });
  } catch (error) {
    console.error("Error updating user account:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user account" });
  }
});

// Delete a user account
app.delete("/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    await db.run("DELETE FROM user_accounts WHERE id = ?", [userId]);
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user account" });
  }
});

export default app;
