-- Nexarox iGaming Platform Database Schema

-- Custom ENUM types
CREATE TYPE bet_type AS ENUM ('ORDINARY', 'EXPRESS', 'SYSTEM');
CREATE TYPE bet_status AS ENUM ('PENDING', 'WON', 'LOST', 'CANCELLED');
CREATE TYPE tx_type AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'BET_PLACEMENT', 'BET_PAYOUT');
CREATE TYPE tx_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player wallets table
CREATE TABLE player_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL,
    balance DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id, currency)
);

-- Financial ledger table
CREATE TABLE financial_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES player_wallets(id) ON DELETE CASCADE,
    tx_type tx_type NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    status tx_status NOT NULL DEFAULT 'PENDING',
    reference VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bet tickets table
CREATE TABLE bet_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    bet_type bet_type NOT NULL,
    stake DECIMAL(18, 2) NOT NULL,
    coefficient DECIMAL(10, 4) NOT NULL,
    potential_payout DECIMAL(18, 2) NOT NULL,
    status bet_status NOT NULL DEFAULT 'PENDING',
    selections JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settled_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_player_wallets_player_id ON player_wallets(player_id);
CREATE INDEX idx_financial_ledger_player_id ON financial_ledger(player_id);
CREATE INDEX idx_financial_ledger_wallet_id ON financial_ledger(wallet_id);
CREATE INDEX idx_bet_tickets_player_id ON bet_tickets(player_id);
CREATE INDEX idx_bet_tickets_status ON bet_tickets(status);
