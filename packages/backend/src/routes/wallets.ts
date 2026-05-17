import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();

// In-memory store (replace with database in production)
const wallets: Map<
  string,
  { id: string; player_id: string; currency: string; balance: number }
> = new Map();

export function clearWallets(): void {
  wallets.clear();
}

export function getWallets(): Map<
  string,
  { id: string; player_id: string; currency: string; balance: number }
> {
  return wallets;
}

router.get("/:userId", verifyToken, (req: AuthRequest, res: Response): void => {
  const { userId } = req.params;
  const userWallets = Array.from(wallets.values()).filter(
    (w) => w.player_id === userId
  );
  res.json(userWallets);
});

router.post("/", verifyToken, (req: AuthRequest, res: Response): void => {
  const { player_id, currency } = req.body;

  if (!player_id || !currency) {
    res.status(400).json({ error: "player_id and currency are required" });
    return;
  }

  // Check for duplicate wallet
  for (const wallet of wallets.values()) {
    if (wallet.player_id === player_id && wallet.currency === currency) {
      res.status(409).json({ error: "Wallet already exists for this currency" });
      return;
    }
  }

  const id = uuidv4();
  const wallet = { id, player_id, currency, balance: 0 };
  wallets.set(id, wallet);

  res.status(201).json(wallet);
});

router.patch("/:id/balance", verifyToken, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { amount } = req.body;

  if (amount === undefined || typeof amount !== "number") {
    res.status(400).json({ error: "amount is required and must be a number" });
    return;
  }

  const wallet = wallets.get(id);
  if (!wallet) {
    res.status(404).json({ error: "Wallet not found" });
    return;
  }

  wallet.balance += amount;
  wallets.set(id, wallet);

  res.json(wallet);
});

export default router;
