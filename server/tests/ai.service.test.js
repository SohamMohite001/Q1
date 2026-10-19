import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AiService } from "../src/services/ai.service.js";

describe("AI Service & Grounding Tests", () => {
  const sampleFaq = {
    id: "FAQ001",
    category: "Admissions",
    question: "How can I apply for admission to the college?",
    answer: "Admission applications must be submitted through the official state centralized admission counseling portal.",
    keywords: ["apply", "admission"]
  };

  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("should return the exact verified FAQ answer with mode 'retrieval' when AI is disabled", async () => {
    const service = new AiService({ enabled: false });
    const result = await service.generateGroundedAnswer("How to apply?", sampleFaq);

    expect(result.answer).toBe(sampleFaq.answer);
    expect(result.mode).toBe("retrieval");
  });

  it("should return verified FAQ answer when API key or base URL is missing", async () => {
    const service = new AiService({ enabled: true, apiKey: "", baseUrl: "" });
    const result = await service.generateGroundedAnswer("How to apply?", sampleFaq);

    expect(result.answer).toBe(sampleFaq.answer);
    expect(result.mode).toBe("retrieval");
  });

  it("should invoke provider and return grounded response when configured", async () => {
    const mockModelResponse = {
      choices: [
        {
          message: {
            content: "You can apply through the official state centralized counseling portal."
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockModelResponse
    });

    const service = new AiService({
      enabled: true,
      apiKey: "mock-key",
      baseUrl: "https://mock-provider.api/v1",
      model: "mock-nemotron"
    });

    const result = await service.generateGroundedAnswer("How to apply?", sampleFaq);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.answer).toBe("You can apply through the official state centralized counseling portal.");
    expect(result.mode).toBe("ai");
  });

  it("should safely fall back to verified FAQ answer if provider returns HTTP error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error"
    });

    const service = new AiService({
      enabled: true,
      apiKey: "mock-key",
      baseUrl: "https://mock-provider.api/v1"
    });

    const result = await service.generateGroundedAnswer("How to apply?", sampleFaq);

    expect(result.answer).toBe(sampleFaq.answer);
    expect(result.mode).toBe("retrieval");
    expect(result.aiFallback).toBe(true);
  });

  it("should safely fall back to verified FAQ answer if provider returns empty content", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: "   " } }] })
    });

    const service = new AiService({
      enabled: true,
      apiKey: "mock-key",
      baseUrl: "https://mock-provider.api/v1"
    });

    const result = await service.generateGroundedAnswer("How to apply?", sampleFaq);

    expect(result.answer).toBe(sampleFaq.answer);
    expect(result.mode).toBe("retrieval");
    expect(result.aiFallback).toBe(true);
  });

  it("should safely fall back to verified FAQ answer if fetch throws network error or times out", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network connection reset"));

    const service = new AiService({
      enabled: true,
      apiKey: "mock-key",
      baseUrl: "https://mock-provider.api/v1"
    });

    const result = await service.generateGroundedAnswer("How to apply?", sampleFaq);

    expect(result.answer).toBe(sampleFaq.answer);
    expect(result.mode).toBe("retrieval");
    expect(result.aiFallback).toBe(true);
  });

  it("should throw error and reject execution if matchedFaq is null or missing", async () => {
    const service = new AiService({ enabled: true, apiKey: "key", baseUrl: "url" });
    await expect(service.generateGroundedAnswer("How to apply?", null)).rejects.toThrow(
      "Cannot invoke AI service without verified FAQ context"
    );
  });
});
