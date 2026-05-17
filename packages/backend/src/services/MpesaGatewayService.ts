import axios from "axios";

export interface MpesaSTKPushRequest {
  phone_number: string;
  amount: number;
  currency: string;
  tx_ref: string;
}

export interface MpesaSTKPushResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_id: string;
    status: string;
  };
}

export class MpesaGatewayService {
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor() {
    this.baseUrl =
      process.env.FLUTTERWAVE_BASE_URL || "https://api.flutterwave.com/v3";
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || "";
  }

  async initiateSTKPush(
    request: MpesaSTKPushRequest
  ): Promise<MpesaSTKPushResponse> {
    const payload = {
      phone_number: request.phone_number,
      amount: request.amount,
      currency: request.currency,
      tx_ref: request.tx_ref,
      type: "mpesa",
    };

    const response = await axios.post(
      `${this.baseUrl}/charges?type=mpesa`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
}
