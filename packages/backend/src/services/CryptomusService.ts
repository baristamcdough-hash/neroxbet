import axios from "axios";
import crypto from "crypto";

export interface CryptomusDepositRequest {
  currency: string;
  order_id: string;
  amount: string | number;
}

export interface CryptomusDepositResponse {
  status: string;
  result?: {
    uuid: string;
    order_id: string;
    address: string;
    currency: string;
    amount: string;
    url: string;
  };
}

export class CryptomusService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly merchantId: string;

  constructor() {
    this.baseUrl =
      process.env.CRYPTOMUS_BASE_URL || "https://api.cryptomus.com/v1";
    this.apiKey = process.env.CRYPTOMUS_API_KEY || "";
    this.merchantId = process.env.CRYPTOMUS_MERCHANT_ID || "";
  }

  generateSignature(payload: Record<string, unknown>): string {
    const jsonPayload = JSON.stringify(payload);
    const base64Payload = Buffer.from(jsonPayload).toString("base64");
    return crypto
      .createHash("md5")
      .update(base64Payload + this.apiKey)
      .digest("hex");
  }

  async createDepositAddress(
    request: CryptomusDepositRequest
  ): Promise<CryptomusDepositResponse> {
    const payload: Record<string, unknown> = {
      amount: String(request.amount),
      currency: request.currency,
      order_id: request.order_id,
    };

    const signature = this.generateSignature(payload);

    const response = await axios.post(
      `${this.baseUrl}/payment`,
      payload,
      {
        headers: {
          merchant: this.merchantId,
          sign: signature,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
}
