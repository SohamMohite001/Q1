import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Backend API Integration Tests", () => {
  describe("GET /api/health", () => {
    it("should return HTTP 200 and health status object", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("college-faq-chatbot-api");
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe("GET /api/faq/list", () => {
    it("should return HTTP 200 with complete FAQ list and sample metadata", async () => {
      const res = await request(app).get("/api/faq/list");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(25);
      expect(Array.isArray(res.body.faqs)).toBe(true);
      expect(res.body.metadata.dataType).toBe("sample");
      expect(res.body.metadata.verified).toBe(false);
      expect(res.body.metadata.disclaimer).toBeDefined();

      // Ensure no private environment variables or secrets leaked
      expect(res.body.NEMOTRON_API_KEY).toBeUndefined();
    });
  });

  describe("POST /api/faq/ask", () => {
    it("should answer a valid supported question from knowledge base", async () => {
      const res = await request(app)
        .post("/api/faq/ask")
        .send({ question: "How can I apply for admission to the college?" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.answeredFromKnowledgeBase).toBe(true);
      expect(res.body.sourceFaqIds).toContain("FAQ001");
      expect(typeof res.body.answer).toBe("string");
      expect(res.body.answer.length).toBeGreaterThan(15);
    });

    it("should answer a paraphrased question from knowledge base", async () => {
      const res = await request(app)
        .post("/api/faq/ask")
        .send({ question: "What is the procedure for joining this college?" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.answeredFromKnowledgeBase).toBe(true);
      expect(res.body.sourceFaqIds).toContain("FAQ001");
    });

    it("should return fallback for unsupported question absent from knowledge base", async () => {
      const res = await request(app)
        .post("/api/faq/ask")
        .send({ question: "Are spaceships allowed to land on the college football ground?" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.answeredFromKnowledgeBase).toBe(false);
      expect(res.body.mode).toBe("fallback");
      expect(res.body.sourceFaqIds).toEqual([]);
      expect(res.body.answer).toMatch(/couldn't find this information/i);
    });

    it("should reject empty question with HTTP 400", async () => {
      const res = await request(app)
        .post("/api/faq/ask")
        .send({ question: "    " });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Invalid request payload");
    });

    it("should reject missing question field with HTTP 400", async () => {
      const res = await request(app)
        .post("/api/faq/ask")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toBeDefined();
    });

    it("should reject non-string question with HTTP 400", async () => {
      const res = await request(app)
        .post("/api/faq/ask")
        .send({ question: 12345 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject excessively long question (> 500 characters) with HTTP 400", async () => {
      const longQuery = "a".repeat(501);
      const res = await request(app)
        .post("/api/faq/ask")
        .send({ question: longQuery });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should return HTTP 404 for unknown endpoints", async () => {
      const res = await request(app).get("/api/unknown-endpoint-xyz");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Resource not found/);
    });

    it("should return HTTP 400 for malformed JSON body", async () => {
      const res = await request(app)
        .post("/api/faq/ask")
        .set("Content-Type", "application/json")
        .send("{\"question\": broken json without closing");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Malformed JSON/);
    });
  });
});
