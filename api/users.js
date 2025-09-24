import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

// POST /users/register
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      // Create the user (password will be hashed in the createUser function)
      const user = await createUser(username, password);

      // Create a token with the user's ID
      const token = createToken({ userId: user.id });

      // Send success response with token
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      // Handle duplicate username error (PostgreSQL unique constraint)
      if (error.code === "23505") {
        return res.status(400).json({
          error: "Username already exists",
        });
      }

      // Handle other errors
      console.error("Registration error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

// POST /users/login
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      // Authenticate user
      const user = await getUserByUsernameAndPassword(username, password);

      if (!user) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      // Create a token with the user's ID
      const token = createToken({ userId: user.id });

      // Send token as plain text (as expected by tests)
      res.status(200).send(token);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);
