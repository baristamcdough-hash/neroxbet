export enum BetType {
  ORDINARY = "ORDINARY",
  EXPRESS = "EXPRESS",
  SYSTEM = "SYSTEM",
}

export enum BetStatus {
  PENDING = "PENDING",
  WON = "WON",
  LOST = "LOST",
  CANCELLED = "CANCELLED",
}

export enum TxType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  BET_PLACEMENT = "BET_PLACEMENT",
  BET_PAYOUT = "BET_PAYOUT",
}

export enum TxStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Player {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface PlayerWallet {
  id: string;
  player_id: string;
  currency: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export interface BetTicket {
  id: string;
  player_id: string;
  bet_type: BetType;
  stake: number;
  coefficient: number;
  potential_payout: number;
  status: BetStatus;
  selections: Record<string, unknown>[];
  created_at: Date;
  settled_at: Date | null;
}

export interface FinancialLedger {
  id: string;
  player_id: string;
  wallet_id: string;
  tx_type: TxType;
  amount: number;
  status: TxStatus;
  reference: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}
