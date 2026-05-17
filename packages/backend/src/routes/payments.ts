import { Router, Request, Response } from "express";
import { MpesaGatewayService } from "../services/MpesaGatewayService";
import { KassifyMtnService } from "../services/KassifyMtnService";
import { CryptomusService } from "../services/CryptomusService";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = Router();

const mpesaService = new MpesaGatewayService();
const kassifyService = new KassifyMtnService();
const cryptomusService = new CryptomusService();

// M-Pesa STK Push via Flutterwave
router.post("/mpesa/initiate", verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phone_number, amount, currency, tx_ref } = req.body;

    if (!phone_number || !amount || !currency || !tx_ref) {
      res.status(400).json({ error: "phone_number, amount, currency, and tx_ref are required" });
      return;
    }

    const result = await mpesaService.initiateSTKPush({
      phone_number,
      amount,
      currency,
      tx_ref,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "M-Pesa initiation failed" });
  }
});

// MTN MoMo Payout via Kassify
router.post("/mtn/payout", verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { phone_number, amount, currency, reference } = req.body;

    if (!phone_number || !amount || !currency || !reference) {
      res.status(400).json({ error: "phone_number, amount, currency, and reference are required" });
      return;
    }

    const result = await kassifyService.initiatePayout({
      phone_number,
      amount,
      currency,
      reference,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "MTN payout failed" });
  }
});

// Cryptomus deposit address
router.post("/crypto/deposit-address", verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currency, order_id, amount } = req.body;

    if (!currency || !order_id || !amount) {
      res.status(400).json({ error: "currency, order_id, and amount are required" });
      return;
    }

    const result = await cryptomusService.createDepositAddress({
      currency,
      order_id,
      amount,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Crypto deposit address generation failed" });
  }
});

// Webhook: Flutterwave
router.post("/webhook/flutterwave", (req: Request, res: Response): void => {
  const payload = req.body;

  // Verify webhook signature in production
  // Process M-Pesa payment confirmation
  console.log("Flutterwave webhook received:", payload?.event);

  res.status(200).json({ status: "received" });
});

// Webhook: Kassify
router.post("/webhook/kassify", (req: Request, res: Response): void => {
  const payload = req.body;

  // Verify HMAC signature in production
  // Process MTN MoMo payout confirmation
  console.log("Kassify webhook received:", payload?.event);

  res.status(200).json({ status: "received" });
});

// Webhook: Cryptomus
router.post("/webhook/cryptomus", (req: Request, res: Response): void => {
  const payload = req.body;

  // Verify MD5 signature in production
  // Process crypto deposit confirmation
  console.log("Cryptomus webhook received:", payload?.event);

  res.status(200).json({ status: "received" });
});

export default router;
