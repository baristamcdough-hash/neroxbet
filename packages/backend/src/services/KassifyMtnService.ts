import axios from "axios";
import crypto from "crypto";

export interface KassifyPayoutRequest {
  phone_number: string;
  amount: number;
  currency: string;
  reference: string;
}

export interface KassifyPayoutResponse {
  status: string;
  message: string;
  data?: {
    transaction_id: string;
    reference: string;
    status: string;
  };
}

export class KassifyMtnService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly secretKey: string;

  constructor() {
    this.baseUrl =
      process.env.KASSIFY_BASE_URL || "https://api.kassify.com/v1";
    this.apiKey = process.env.KASSIFY_API_KEY || "";
    this.secretKey = process.env.KASSIFY_SECRET_KEY || "";
  }

  generateHmacSignature(payload: Record<string, unknown>): string {
    const sortedKeys = Object.keys(payload).sort();
    const signatureString = sortedKeys
      .map((key) => `${key}=${payload[key]}`)
      .join("&");

    return crypto
      .createHmac("sha256", this.secretKey)
      .update(signatureString)
      .digest("hex");
  }

  async initiatePayout(
    request: KassifyPayoutRequest
  ): Promise<KassifyPayoutResponse> {
    const payload: Record<string, unknown> = {
      phone_number: request.phone_number,
      amount: request.amount,
      currency: request.currency,
      reference: request.reference,
      type: "mtn_momo",
    };

    const signature = this.generateHmacSignature(payload);

    const response = await axios.post(
      `${this.baseUrl}/payouts`,
      payload,
      {
        headers: {
          "X-API-Key": this.apiKey,
          "X-Signature": signature,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
}
