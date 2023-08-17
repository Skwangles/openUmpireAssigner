import db from "./db";
import { verifyPassword, isAuthenticated } from "./auth";
import { Router } from "express";

const app = Router();

export const getUmpire = async (username) => {
  // Check if the user exists in the 'users' table
  const user = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
  return user;
};

// API endpoint to get all umpires (Sensitive data hidden for unauthenticated users)
app.get("/umpires", isAuthenticated, async (req, res) => {
  const { username, password } = req.headers;
  if (!username || !password) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  // Check if the user exists in the 'users' table
  const user = await new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  // If authenticated, fetch umpires data with limited sensitive information
  db.all(
    "SELECT id, club_id, teams_id, restrictedturfs_id, BlockoutDates, LimitedTimes, levels_id, communication_id, ToBeAwareOf, Notes FROM umpires",
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
      } else {
        res.json(rows);
      }
    }
  );
});

// API endpoint to add a new umpire
app.post("/umpires", isAuthenticated, (req, res) => {
  const {
    Name,
    Email,
    Phone,
    club_id,
    teams_id,
    restrictedturfs_id,
    BlockoutDates,
    LimitedTimes,
    communication_id,
    ToBeAwareOf,
    Notes,
    selectedLevels, // Array of selected level IDs
  } = req.body;

  const query = `
      INSERT INTO umpires (
        Name, Email, Phone, club_id, teams_id, restrictedturfs_id,
        BlockoutDates, LimitedTimes, communication_id, ToBeAwareOf, Notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.run(
    query,
    [
      Name,
      Email,
      Phone,
      club_id,
      teams_id,
      restrictedturfs_id,
      BlockoutDates,
      LimitedTimes,
      communication_id,
      ToBeAwareOf,
      Notes,
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
      } else {
        // Get the ID of the newly added umpire
        const umpireId = this.lastID;

        // Associate selected levels with the umpire in the 'umpire_levels' table
        if (selectedLevels && selectedLevels.length > 0) {
          const levelInsertQuery =
            "INSERT INTO umpire_levels (umpire_id, level_id) VALUES (?, ?)";
          selectedLevels.forEach((level_id) => {
            db.run(levelInsertQuery, [umpireId, level_id], (err) => {
              if (err) {
                console.error(err.message);
              }
            });
          });
        }

        res.json({ message: "Umpire added successfully" });
      }
    }
  );
});

// API endpoint to update an umpire
app.patch("/umpires/:id", isAuthenticated, (req, res) => {
  const id = req.params.id;
  const updatedFields = req.body;
  const selectedLevels = req.body.selectedLevels; // Array of selected level IDs

  const updateQuery = Object.keys(updatedFields)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updatedFields);

  db.run(
    `UPDATE umpires SET ${updateQuery} WHERE id = ?`,
    [...values, id],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
      } else {
        // Update associated levels in the 'umpire_levels' table
        if (selectedLevels && selectedLevels.length > 0) {
          db.run(
            "DELETE FROM umpire_levels WHERE umpire_id = ?",
            [id],
            (err) => {
              if (err) {
                console.error(err.message);
              } else {
                const levelInsertQuery =
                  "INSERT INTO umpire_levels (umpire_id, level_id) VALUES (?, ?)";
                selectedLevels.forEach((level_id) => {
                  db.run(levelInsertQuery, [id, level_id], (err) => {
                    if (err) {
                      console.error(err.message);
                    }
                  });
                });
              }
            }
          );
        }

        res.json({ message: "Umpire updated successfully" });
      }
    }
  );
});

// API endpoint to delete an umpire
app.delete("/umpires/:id", isAuthenticated, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM umpires WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    } else {
      // Delete associated levels in the 'umpire_levels' table
      db.run("DELETE FROM umpire_levels WHERE umpire_id = ?", [id], (err) => {
        if (err) {
          console.error(err.message);
        }
        res.json({ message: "Umpire deleted successfully" });
      });
    }
  });
});

export default app;
