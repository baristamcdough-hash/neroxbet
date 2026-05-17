import axios from "axios";
import { MpesaGatewayService } from "../../src/services/MpesaGatewayService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("MpesaGatewayService", () => {
  let service: MpesaGatewayService;

  beforeEach(() => {
    process.env.FLUTTERWAVE_SECRET_KEY = "test-secret-key";
    process.env.FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";
    service = new MpesaGatewayService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should initiate STK push with correct payload", async () => {
    const mockResponse = {
      data: {
        status: "success",
        message: "Charge initiated",
        data: {
          id: 123,
          tx_ref: "TX-REF-001",
          flw_ref: "FLW-REF-001",
          device_id: "device-001",
          status: "pending",
        },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await service.initiateSTKPush({
      phone_number: "254712345678",
      amount: 1000,
      currency: "KES",
      tx_ref: "TX-REF-001",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://api.flutterwave.com/v3/charges?type=mpesa",
      {
        phone_number: "254712345678",
        amount: 1000,
        currency: "KES",
        tx_ref: "TX-REF-001",
        type: "mpesa",
      },
      {
        headers: {
          Authorization: "Bearer test-secret-key",
          "Content-Type": "application/json",
        },
      }
    );

    expect(result.status).toBe("success");
    expect(result.data?.tx_ref).toBe("TX-REF-001");
  });

  it("should use correct authorization header", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { status: "success", message: "OK" },
    });

    await service.initiateSTKPush({
      phone_number: "254712345678",
      amount: 500,
      currency: "KES",
      tx_ref: "TX-REF-002",
    });

    const callArgs = mockedAxios.post.mock.calls[0];
    expect(callArgs[2]?.headers?.Authorization).toBe("Bearer test-secret-key");
  });

  it("should throw on axios error", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));

    await expect(
      service.initiateSTKPush({
        phone_number: "254712345678",
        amount: 1000,
        currency: "KES",
        tx_ref: "TX-REF-003",
      })
    ).rejects.toThrow("Network error");
  });
});
