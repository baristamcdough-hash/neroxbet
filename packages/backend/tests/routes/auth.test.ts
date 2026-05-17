import { clearPlayers, getPlayers } from "../../src/routes/auth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import request from "supertest";
import authRouter from "../../src/routes/auth";

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("Auth Routes", () => {
  beforeEach(() => {
    clearPlayers();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user and return a token", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.username).toBe("testuser");
      expect(res.body.email).toBe("test@example.com");
      expect(res.body.token).toBeDefined();
      expect(res.body.id).toBeDefined();
    });

    it("should return 400 if fields are missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 409 if user already exists", async () => {
      await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.username).toBe("testuser");
    });

    it("should return 401 for invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
    });

    it("should return 401 for invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });

    it("should return 400 if fields are missing", async () => {
      const res = await request(app).post("/api/auth/login").send({});

      expect(res.status).toBe(400);
    });

    it("should generate a valid JWT token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      const decoded = jwt.verify(res.body.token, "default-secret") as {
        userId: string;
      };
      expect(decoded.userId).toBeDefined();
    });
  });
});
