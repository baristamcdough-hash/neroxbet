import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const JWT_EXPIRES_IN = 86400; // 24 hours in seconds

// In-memory store (replace with database in production)
const players: Map<
  string,
  { id: string; username: string; email: string; password_hash: string }
> = new Map();

export function clearPlayers(): void {
  players.clear();
}

export function getPlayers(): Map<
  string,
  { id: string; username: string; email: string; password_hash: string }
> {
  return players;
}

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Username, email, and password are required" });
      return;
    }

    // Check if user exists
    for (const player of players.values()) {
      if (player.email === email || player.username === username) {
        res.status(409).json({ error: "User already exists" });
        return;
      }
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);

    players.set(id, { id, username, email, password_hash });

    const token = jwt.sign({ userId: id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({ id, username, email, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    let foundPlayer: { id: string; username: string; email: string; password_hash: string } | null = null;

    for (const player of players.values()) {
      if (player.email === email) {
        foundPlayer = player;
        break;
      }
    }

    if (!foundPlayer) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, foundPlayer.password_hash);

    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: foundPlayer.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ id: foundPlayer.id, username: foundPlayer.username, email: foundPlayer.email, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
