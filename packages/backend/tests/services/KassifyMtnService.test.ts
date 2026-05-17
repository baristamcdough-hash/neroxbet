import axios from "axios";
import crypto from "crypto";
import { KassifyMtnService } from "../../src/services/KassifyMtnService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("KassifyMtnService", () => {
  let service: KassifyMtnService;

  beforeEach(() => {
    process.env.KASSIFY_API_KEY = "test-api-key";
    process.env.KASSIFY_SECRET_KEY = "test-secret-key";
    process.env.KASSIFY_BASE_URL = "https://api.kassify.com/v1";
    service = new KassifyMtnService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should generate correct HMAC signature", () => {
    const payload = {
      amount: 5000,
      currency: "UGX",
      phone_number: "256701234567",
      reference: "REF-001",
      type: "mtn_momo",
    };

    const signature = service.generateHmacSignature(payload);

    // Verify signature is generated using sorted keys
    const sortedKeys = Object.keys(payload).sort();
    const signatureString = sortedKeys
      .map((key) => `${key}=${payload[key as keyof typeof payload]}`)
      .join("&");

    const expected = crypto
      .createHmac("sha256", "test-secret-key")
      .update(signatureString)
      .digest("hex");

    expect(signature).toBe(expected);
  });

  it("should initiate payout with correct payload and headers", async () => {
    const mockResponse = {
      data: {
        status: "success",
        message: "Payout initiated",
        data: {
          transaction_id: "TXN-001",
          reference: "REF-001",
          status: "pending",
        },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await service.initiatePayout({
      phone_number: "256701234567",
      amount: 5000,
      currency: "UGX",
      reference: "REF-001",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://api.kassify.com/v1/payouts",
      {
        phone_number: "256701234567",
        amount: 5000,
        currency: "UGX",
        reference: "REF-001",
        type: "mtn_momo",
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-API-Key": "test-api-key",
          "X-Signature": expect.any(String),
          "Content-Type": "application/json",
        }),
      })
    );

    expect(result.status).toBe("success");
    expect(result.data?.transaction_id).toBe("TXN-001");
  });

  it("should throw on axios error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    await expect(
      service.initiatePayout({
        phone_number: "256701234567",
        amount: 5000,
        currency: "UGX",
        reference: "REF-002",
      })
    ).rejects.toThrow("Network error");
  });
});
