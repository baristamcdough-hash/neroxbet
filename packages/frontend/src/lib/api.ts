const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiOptions extends RequestInit {
  token?: string;
}

async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: requestHeaders,
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export interface AuthResponse {
  token: string;
  userId: string;
}

export interface Wallet {
  id: string;
  player_id: string;
  currency_code: string;
  balance: number;
  bonus_balance: number;
}

export interface BetResponse {
  id: string;
  player_id: string;
  bet_type: string;
  stake: number;
  coefficient: number;
  potential_payout: number;
  status: string;
  selections: unknown[];
}

export function registerUser(email: string, password: string): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function loginUser(email: string, password: string): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getWallets(userId: string, token: string): Promise<Wallet[]> {
  return apiClient<Wallet[]>(`/api/wallets/${userId}`, { token });
}

export function createWallet(playerId: string, currencyCode: string, token: string): Promise<Wallet> {
  return apiClient<Wallet>("/api/wallets", {
    method: "POST",
    token,
    body: JSON.stringify({ player_id: playerId, currency_code: currencyCode }),
  });
}

export function updateWalletBalance(walletId: string, amount: number, token: string): Promise<Wallet> {
  return apiClient<Wallet>(`/api/wallets/${walletId}/balance`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ amount }),
  });
}

export function placeBet(
  playerId: string,
  betType: string,
  stake: number,
  selections: unknown[],
  token: string
): Promise<BetResponse> {
  return apiClient<BetResponse>("/api/bets", {
    method: "POST",
    token,
    body: JSON.stringify({ player_id: playerId, bet_type: betType, stake, selections }),
  });
}

export function getBets(userId: string, token: string): Promise<BetResponse[]> {
  return apiClient<BetResponse[]>(`/api/bets/${userId}`, { token });
}
