export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  sport: string;
  startTime: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface PayoutEntry {
  id: string;
  username: string;
  amount: number;
  currency: string;
  method: string;
  timestamp: string;
}

export interface SportCategory {
  name: string;
  regions: {
    name: string;
    leagues: string[];
  }[];
}

export const matches: Match[] = [
  {
    id: "m1",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    league: "La Liga",
    sport: "Football",
    startTime: "2024-03-15T20:00:00Z",
    odds: { home: 2.1, draw: 3.4, away: 2.8 },
  },
  {
    id: "m2",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    league: "Premier League",
    sport: "Football",
    startTime: "2024-03-15T17:30:00Z",
    odds: { home: 1.9, draw: 3.6, away: 3.2 },
  },
  {
    id: "m3",
    homeTeam: "Bayern Munich",
    awayTeam: "Dortmund",
    league: "Bundesliga",
    sport: "Football",
    startTime: "2024-03-15T18:30:00Z",
    odds: { home: 1.7, draw: 3.8, away: 4.0 },
  },
  {
    id: "m4",
    homeTeam: "PSG",
    awayTeam: "Marseille",
    league: "Ligue 1",
    sport: "Football",
    startTime: "2024-03-15T21:00:00Z",
    odds: { home: 1.5, draw: 4.2, away: 5.5 },
  },
  {
    id: "m5",
    homeTeam: "LA Lakers",
    awayTeam: "Golden State",
    league: "NBA",
    sport: "Basketball",
    startTime: "2024-03-16T02:00:00Z",
    odds: { home: 1.85, draw: 0, away: 1.95 },
  },
  {
    id: "m6",
    homeTeam: "Djokovic N.",
    awayTeam: "Alcaraz C.",
    league: "ATP Masters",
    sport: "Tennis",
    startTime: "2024-03-16T14:00:00Z",
    odds: { home: 2.2, draw: 0, away: 1.7 },
  },
  {
    id: "m7",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    league: "Serie A",
    sport: "Football",
    startTime: "2024-03-15T19:45:00Z",
    odds: { home: 2.3, draw: 3.2, away: 2.9 },
  },
  {
    id: "m8",
    homeTeam: "Simba SC",
    awayTeam: "Young Africans",
    league: "Tanzania Premier",
    sport: "Football",
    startTime: "2024-03-16T15:00:00Z",
    odds: { home: 2.0, draw: 3.1, away: 3.5 },
  },
];

export const payoutFeed: PayoutEntry[] = [
  { id: "p1", username: "User***42", amount: 15000, currency: "BRL", method: "PIX", timestamp: "2024-03-15T12:01:00Z" },
  { id: "p2", username: "Player***8", amount: 250, currency: "USD", method: "Crypto", timestamp: "2024-03-15T12:02:00Z" },
  { id: "p3", username: "Bet***99", amount: 500000, currency: "TZS", method: "M-Pesa", timestamp: "2024-03-15T12:03:00Z" },
  { id: "p4", username: "Win***17", amount: 75000, currency: "XOF", method: "MTN MoMo", timestamp: "2024-03-15T12:04:00Z" },
  { id: "p5", username: "Lucky***3", amount: 8500, currency: "BRL", method: "PIX", timestamp: "2024-03-15T12:05:00Z" },
  { id: "p6", username: "Star***55", amount: 180, currency: "USD", method: "Crypto", timestamp: "2024-03-15T12:06:00Z" },
];

export const sportHierarchy: SportCategory[] = [
  {
    name: "Football",
    regions: [
      { name: "Spain", leagues: ["La Liga", "Copa del Rey"] },
      { name: "England", leagues: ["Premier League", "FA Cup"] },
      { name: "Germany", leagues: ["Bundesliga", "DFB Pokal"] },
      { name: "France", leagues: ["Ligue 1"] },
      { name: "Italy", leagues: ["Serie A"] },
      { name: "Tanzania", leagues: ["Tanzania Premier"] },
    ],
  },
  {
    name: "Basketball",
    regions: [
      { name: "USA", leagues: ["NBA", "NCAA"] },
      { name: "Europe", leagues: ["EuroLeague"] },
    ],
  },
  {
    name: "Tennis",
    regions: [
      { name: "International", leagues: ["ATP Masters", "WTA", "Grand Slam"] },
    ],
  },
];
