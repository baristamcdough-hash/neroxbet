import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import walletsRouter from "./routes/wallets";
import betsRouter from "./routes/bets";
import paymentsRouter from "./routes/payments";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/wallets", walletsRouter);
app.use("/api/bets", betsRouter);
app.use("/api/payments", paymentsRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
