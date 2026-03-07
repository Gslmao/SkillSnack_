import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Streak logic helper
function calculateStreak(currentStreak, lastActive) {
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const last = lastActive
    ? new Date(lastActive).toISOString().split("T")[0]
    : null;

  if (!last) {
    // First time ever
    return { newStreak: 1, isNewDay: true };
  }

  const todayDate = new Date(today);
  const lastDate = new Date(last);
  const diffMs = todayDate - lastDate;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already active today, no change
    return { newStreak: currentStreak, isNewDay: false };
  } else if (diffDays === 1) {
    // Consecutive day, increment
    return { newStreak: currentStreak + 1, isNewDay: true };
  } else {
    // Missed a day, reset
    return { newStreak: 1, isNewDay: true };
  }
}

// Allow the requesting origin in development (Expo web runs on http://localhost:8081)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins (including undefined for tools like curl / Postman)
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Sign up
app.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Error in /auth/signup:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Error in /auth/login:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Refresh access token
app.post("/auth/refresh", async (req, res) => {
  const { refresh_token } = req.body || {};

  if (!refresh_token) {
    return res.status(400).json({ error: "refresh_token is required." });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error("Error in /auth/refresh:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Middleware to extract user from Bearer token
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error("Error in authMiddleware:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}

// Current user
app.get("/auth/me", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

// Stateless logout – client should discard tokens; this is mainly for a consistent API
app.post("/auth/logout", (_req, res) => {
  return res.json({ success: true });
});

// Current user profile from "users" table (includes XP & streak)
app.get("/users/me", authMiddleware, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: "Missing user id on auth context." });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, xp, streak, best_streak, last_active, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching /users/me:", error);
      return res.status(500).json({ error: "Failed to fetch user profile." });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ user: data });
  } catch (err) {
    console.error("Unexpected error in /users/me:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Increment user XP
// Body: { userId: string (uuid), amount: number }
app.post("/users/xp", async (req, res) => {
  const { userId, amount } = req.body || {};

  if (!userId || amount === undefined) {
    return res
      .status(400)
      .json({ error: "userId and amount are required." });
  }

  const increment = Number(amount);
  if (!Number.isFinite(increment) || !Number.isInteger(increment)) {
    return res
      .status(400)
      .json({ error: "amount must be a valid integer." });
  }

  try {
    // Get current XP
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, xp")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching user for XP update:", fetchError);
      return res.status(500).json({ error: "Failed to fetch user." });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const currentXp = user.xp || 0;
    const newXp = currentXp + increment;

    // Update only xp (streak and other fields left unchanged)
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ xp: newXp })
      .eq("id", userId)
      .select("id, xp, streak, best_streak, last_active, created_at")
      .maybeSingle();

    if (updateError) {
      console.error("Error updating user XP:", updateError);
      return res.status(500).json({ error: "Failed to update XP." });
    }

    return res.json({ user: updatedUser });
  } catch (err) {
    console.error("Unexpected error in /users/xp:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Call this when a user completes a lesson to update streak.
// Body: { userId: string }
app.post("/users/streak", async (req, res) => {
  const { userId } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, streak, best_streak, last_active")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching user for streak update:", fetchError);
      return res.status(500).json({ error: "Failed to fetch user." });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { newStreak, isNewDay } = calculateStreak(
      user.streak || 0,
      user.last_active
    );

    if (!isNewDay) {
      // Already completed a lesson today, just return current state
      return res.json({ user, alreadyCompletedToday: true });
    }

    const today = new Date().toISOString().split("T")[0];
    const newBestStreak = Math.max(newStreak, user.best_streak || 0);

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        streak: newStreak,
        best_streak: newBestStreak,
        last_active: today,
      })
      .eq("id", userId)
      .select("id, xp, streak, best_streak, last_active")
      .maybeSingle();

    if (updateError) {
      console.error("Error updating streak:", updateError);
      return res.status(500).json({ error: "Failed to update streak." });
    }

    return res.json({ user: updatedUser, alreadyCompletedToday: false });
  } catch (err) {
    console.error("Unexpected error in /users/streak:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`SkillSnack backend listening on port ${port}`);
});

