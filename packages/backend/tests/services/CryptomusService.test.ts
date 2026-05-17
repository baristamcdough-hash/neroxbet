import axios from "axios";
import crypto from "crypto";
import { CryptomusService } from "../../src/services/CryptomusService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CryptomusService", () => {
  let service: CryptomusService;

  beforeEach(() => {
    process.env.CRYPTOMUS_API_KEY = "test-api-key";
    process.env.CRYPTOMUS_MERCHANT_ID = "test-merchant-id";
    process.env.CRYPTOMUS_BASE_URL = "https://api.cryptomus.com/v1";
    service = new CryptomusService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should generate correct MD5 signature", () => {
    const payload = {
      amount: "100",
      currency: "BTC",
      order_id: "ORDER-001",
    };

    const signature = service.generateSignature(payload);

    // Verify signature using MD5(base64(json) + apiKey)
    const jsonPayload = JSON.stringify(payload);
    const base64Payload = Buffer.from(jsonPayload).toString("base64");
    const expected = crypto
      .createHash("md5")
      .update(base64Payload + "test-api-key")
      .digest("hex");

    expect(signature).toBe(expected);
  });

  it("should create deposit address with correct payload and headers", async () => {
    const mockResponse = {
      data: {
        status: "success",
        result: {
          uuid: "uuid-001",
          order_id: "ORDER-001",
          address: "bc1q...",
          currency: "BTC",
          amount: "100",
          url: "https://pay.cryptomus.com/pay/uuid-001",
        },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await service.createDepositAddress({
      currency: "BTC",
      order_id: "ORDER-001",
      amount: "100",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://api.cryptomus.com/v1/payment",
      {
        amount: "100",
        currency: "BTC",
        order_id: "ORDER-001",
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          merchant: "test-merchant-id",
          sign: expect.any(String),
          "Content-Type": "application/json",
        }),
      })
    );

    expect(result.status).toBe("success");
    expect(result.result?.address).toBe("bc1q...");
  });

  it("should throw on axios error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    await expect(
      service.createDepositAddress({
        currency: "BTC",
        order_id: "ORDER-002",
        amount: "50",
      })
    ).rejects.toThrow("Network error");
  });
});
