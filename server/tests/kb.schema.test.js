import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  faqKnowledgeBaseSchema,
  faqItemSchema,
  metadataSchema,
  ALLOWED_CATEGORIES
} from "../src/validators/faq.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const kbPath = path.resolve(__dirname, "../kb/faqs.json");

describe("Knowledge Base Schema Tests", () => {
  const rawKb = fs.readFileSync(kbPath, "utf-8");
  const kbData = JSON.parse(rawKb);

  it("should validate the complete production faqs.json dataset", () => {
    const result = faqKnowledgeBaseSchema.safeParse(kbData);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.error(result.error);
    }
  });

  it("should have at least 25 FAQs (minimum assignment requirement)", () => {
    expect(kbData.faqs.length).toBeGreaterThanOrEqual(25);
    // Margined target >= 30
    expect(kbData.faqs.length).toBeGreaterThanOrEqual(30);
  });

  it("should cover at least 7 distinct valid categories", () => {
    const categoriesPresent = new Set(kbData.faqs.map(f => f.category));
    expect(categoriesPresent.size).toBeGreaterThanOrEqual(7);
    for (const cat of categoriesPresent) {
      expect(ALLOWED_CATEGORIES).toContain(cat);
    }
  });

  it("should reject dataset if FAQ count is under 25", () => {
    const invalidKb = {
      ...kbData,
      faqs: kbData.faqs.slice(0, 10)
    };
    const result = faqKnowledgeBaseSchema.safeParse(invalidKb);
    expect(result.success).toBe(false);
  });

  it("should reject dataset with duplicate FAQ IDs", () => {
    const duplicateKb = {
      ...kbData,
      faqs: [
        ...kbData.faqs,
        {
          id: kbData.faqs[0].id,
          category: "Admissions",
          question: "Another unique question text here?",
          answer: "Another valid answer text with sufficient length.",
          keywords: ["duplicate", "test"]
        }
      ]
    };
    const result = faqKnowledgeBaseSchema.safeParse(duplicateKb);
    expect(result.success).toBe(false);
  });

  it("should reject FAQ item with invalid ID format", () => {
    const invalidFaq = {
      id: "INVALID_123",
      category: "Admissions",
      question: "Is this valid?",
      answer: "This is a sufficiently long answer for validation.",
      keywords: ["test"]
    };
    const result = faqItemSchema.safeParse(invalidFaq);
    expect(result.success).toBe(false);
  });

  it("should reject FAQ item with unrecognized category", () => {
    const invalidFaq = {
      id: "FAQ999",
      category: "Astrology and Horoscopes",
      question: "What is my horoscope today?",
      answer: "We do not offer horoscope readings at the college.",
      keywords: ["horoscope"]
    };
    const result = faqItemSchema.safeParse(invalidFaq);
    expect(result.success).toBe(false);
  });

  it("should reject FAQ item with empty question or answer", () => {
    const emptyQ = {
      id: "FAQ999",
      category: "Admissions",
      question: "   ",
      answer: "This is a valid answer text.",
      keywords: ["test"]
    };
    expect(faqItemSchema.safeParse(emptyQ).success).toBe(false);

    const emptyA = {
      id: "FAQ999",
      category: "Admissions",
      question: "Valid question here?",
      answer: "   ",
      keywords: ["test"]
    };
    expect(faqItemSchema.safeParse(emptyA).success).toBe(false);
  });

  it("should reject FAQ item with empty keywords array", () => {
    const noKw = {
      id: "FAQ999",
      category: "Admissions",
      question: "Valid question here?",
      answer: "This is a valid answer text.",
      keywords: []
    };
    expect(faqItemSchema.safeParse(noKw).success).toBe(false);
  });

  it("should require sample dataType and explicit disclaimer in metadata", () => {
    expect(kbData.metadata.dataType).toBe("sample");
    expect(kbData.metadata.verified).toBe(false);
    expect(kbData.metadata.disclaimer).toMatch(/SAMPLE DATA/);
  });
});
