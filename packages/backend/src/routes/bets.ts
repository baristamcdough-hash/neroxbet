import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { BetType, BetStatus } from "@neroxbet/shared";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();

// In-memory store (replace with database in production)
const bets: Map<
  string,
  {
    id: string;
    player_id: string;
    bet_type: BetType;
    stake: number;
    coefficient: number;
    potential_payout: number;
    status: BetStatus;
    selections: Record<string, unknown>[];
  }
> = new Map();

export function clearBets(): void {
  bets.clear();
}

export function getBets(): Map<
  string,
  {
    id: string;
    player_id: string;
    bet_type: BetType;
    stake: number;
    coefficient: number;
    potential_payout: number;
    status: BetStatus;
    selections: Record<string, unknown>[];
  }
> {
  return bets;
}

/**
 * Calculate coefficient based on bet type and selections.
 * - ORDINARY: single selection coefficient
 * - EXPRESS: product of all selection coefficients
 * - SYSTEM: sum of combination products (simplified)
 */
export function calculateCoefficient(
  betType: BetType,
  selections: { coefficient: number }[]
): number {
  if (selections.length === 0) return 1;

  switch (betType) {
    case BetType.ORDINARY:
      return selections[0].coefficient;

    case BetType.EXPRESS:
      return selections.reduce((acc, sel) => acc * sel.coefficient, 1);

    case BetType.SYSTEM: {
      // System bet: average of all pair combinations
      if (selections.length < 2) return selections[0].coefficient;
      let totalCoeff = 0;
      let combinations = 0;
      for (let i = 0; i < selections.length; i++) {
        for (let j = i + 1; j < selections.length; j++) {
          totalCoeff += selections[i].coefficient * selections[j].coefficient;
          combinations++;
        }
      }
      return combinations > 0 ? totalCoeff / combinations : 1;
    }

    default:
      return 1;
  }
}

router.post("/", verifyToken, (req: AuthRequest, res: Response): void => {
  const { player_id, bet_type, stake, selections } = req.body;

  if (!player_id || !bet_type || !stake || !selections) {
    res.status(400).json({ error: "player_id, bet_type, stake, and selections are required" });
    return;
  }

  if (!Object.values(BetType).includes(bet_type)) {
    res.status(400).json({ error: "Invalid bet_type" });
    return;
  }

  if (typeof stake !== "number" || stake <= 0) {
    res.status(400).json({ error: "stake must be a positive number" });
    return;
  }

  const coefficient = calculateCoefficient(bet_type, selections);
  const potential_payout = parseFloat((stake * coefficient).toFixed(2));

  const id = uuidv4();
  const bet = {
    id,
    player_id,
    bet_type,
    stake,
    coefficient,
    potential_payout,
    status: BetStatus.PENDING,
    selections,
  };

  bets.set(id, bet);
  res.status(201).json(bet);
});

router.get("/:userId", verifyToken, (req: AuthRequest, res: Response): void => {
  const { userId } = req.params;
  const userBets = Array.from(bets.values()).filter(
    (b) => b.player_id === userId
  );
  res.json(userBets);
});

router.patch("/:id/status", verifyToken, (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !Object.values(BetStatus).includes(status)) {
    res.status(400).json({ error: "Valid status is required" });
    return;
  }

  const bet = bets.get(id);
  if (!bet) {
    res.status(404).json({ error: "Bet not found" });
    return;
  }

  bet.status = status;
  bets.set(id, bet);

  res.json(bet);
});

export default router;
