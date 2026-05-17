import { calculateCoefficient, clearBets } from "../../src/routes/bets";
import { BetType } from "@neroxbet/shared";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import betsRouter from "../../src/routes/bets";

const app = express();
app.use(express.json());
app.use("/api/bets", betsRouter);

function generateToken(userId: string): string {
  return jwt.sign({ userId }, "default-secret", { expiresIn: "1h" });
}

describe("Bets Routes", () => {
  const token = generateToken("player-001");

  beforeEach(() => {
    clearBets();
  });

  describe("calculateCoefficient", () => {
    it("should return single coefficient for ORDINARY bet", () => {
      const selections = [{ coefficient: 1.5 }];
      const result = calculateCoefficient(BetType.ORDINARY, selections);
      expect(result).toBe(1.5);
    });

    it("should return product of coefficients for EXPRESS bet", () => {
      const selections = [
        { coefficient: 1.5 },
        { coefficient: 2.0 },
        { coefficient: 1.8 },
      ];
      const result = calculateCoefficient(BetType.EXPRESS, selections);
      expect(result).toBeCloseTo(5.4);
    });

    it("should return average of pair combinations for SYSTEM bet", () => {
      const selections = [
        { coefficient: 1.5 },
        { coefficient: 2.0 },
        { coefficient: 1.8 },
      ];
      const result = calculateCoefficient(BetType.SYSTEM, selections);
      // Pairs: 1.5*2.0=3.0, 1.5*1.8=2.7, 2.0*1.8=3.6
      // Average: (3.0+2.7+3.6)/3 = 3.1
      expect(result).toBeCloseTo(3.1);
    });

    it("should return 1 for empty selections", () => {
      const result = calculateCoefficient(BetType.ORDINARY, []);
      expect(result).toBe(1);
    });
  });

  describe("POST /api/bets", () => {
    it("should place an ordinary bet", async () => {
      const res = await request(app)
        .post("/api/bets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          player_id: "player-001",
          bet_type: BetType.ORDINARY,
          stake: 100,
          selections: [{ coefficient: 2.5, event_id: "event-1" }],
        });

      expect(res.status).toBe(201);
      expect(res.body.stake).toBe(100);
      expect(res.body.coefficient).toBe(2.5);
      expect(res.body.potential_payout).toBe(250);
      expect(res.body.status).toBe("PENDING");
    });

    it("should place an express bet with multiplied coefficients", async () => {
      const res = await request(app)
        .post("/api/bets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          player_id: "player-001",
          bet_type: BetType.EXPRESS,
          stake: 50,
          selections: [
            { coefficient: 1.5, event_id: "event-1" },
            { coefficient: 2.0, event_id: "event-2" },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.coefficient).toBeCloseTo(3.0);
      expect(res.body.potential_payout).toBeCloseTo(150);
    });

    it("should return 400 for missing fields", async () => {
      const res = await request(app)
        .post("/api/bets")
        .set("Authorization", `Bearer ${token}`)
        .send({ player_id: "player-001" });

      expect(res.status).toBe(400);
    });

    it("should return 400 for invalid bet_type", async () => {
      const res = await request(app)
        .post("/api/bets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          player_id: "player-001",
          bet_type: "INVALID",
          stake: 100,
          selections: [{ coefficient: 2.0 }],
        });

      expect(res.status).toBe(400);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).post("/api/bets").send({
        player_id: "player-001",
        bet_type: BetType.ORDINARY,
        stake: 100,
        selections: [{ coefficient: 2.0 }],
      });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/bets/:userId", () => {
    it("should return user bets", async () => {
      await request(app)
        .post("/api/bets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          player_id: "player-001",
          bet_type: BetType.ORDINARY,
          stake: 100,
          selections: [{ coefficient: 2.0 }],
        });

      const res = await request(app)
        .get("/api/bets/player-001")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].player_id).toBe("player-001");
    });
  });

  describe("PATCH /api/bets/:id/status", () => {
    it("should settle a bet", async () => {
      const createRes = await request(app)
        .post("/api/bets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          player_id: "player-001",
          bet_type: BetType.ORDINARY,
          stake: 100,
          selections: [{ coefficient: 2.0 }],
        });

      const betId = createRes.body.id;

      const res = await request(app)
        .patch(`/api/bets/${betId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "WON" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("WON");
    });

    it("should return 404 for non-existent bet", async () => {
      const res = await request(app)
        .patch("/api/bets/non-existent-id/status")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "WON" });

      expect(res.status).toBe(404);
    });
  });
});
