import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { retrieveAnswer } from "./retrieval.service.js";
import { defaultAiService } from "./ai.service.js";
import { faqKnowledgeBaseSchema } from "../validators/faq.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultKbPath = path.resolve(__dirname, "../../kb/faqs.json");

export class FaqService {
  constructor(kbPath = defaultKbPath, aiService = defaultAiService) {
    this.kbPath = kbPath;
    this.aiService = aiService;
    this.metadata = null;
    this.faqs = [];
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    if (!fs.existsSync(this.kbPath)) {
      throw new Error(`Knowledge base file not found at: ${this.kbPath}`);
    }

    const raw = fs.readFileSync(this.kbPath, "utf-8");
    const parsed = JSON.parse(raw);

    const validation = faqKnowledgeBaseSchema.safeParse(parsed);
    if (!validation.success) {
      const errorMsg = JSON.stringify(validation.error.format());
      throw new Error(`Knowledge base validation failed: ${errorMsg}`);
    }

    this.metadata = validation.data.metadata;
    this.faqs = validation.data.faqs;
    console.log(`[FaqService] Loaded ${this.faqs.length} FAQs from ${this.kbPath}`);
  }

  getFaqList() {
    return {
      success: true,
      count: this.faqs.length,
      metadata: this.metadata,
      faqs: this.faqs
    };
  }

  async answerQuestion(rawQuestion, options = {}) {
    const question = typeof rawQuestion === "string" ? rawQuestion.trim() : "";

    const threshold = options.threshold ?? parseFloat(process.env.RETRIEVAL_THRESHOLD || "0.30");
    const ambiguityDelta = options.ambiguityDelta ?? parseFloat(process.env.AMBIGUITY_THRESHOLD || "0.06");

    const retrievalResult = retrieveAnswer(question, this.faqs, {
      threshold,
      ambiguityDelta
    });

    // If unsupported or ambiguous, NEVER call AI
    if (!retrievalResult.matched) {
      return {
        success: true,
        answer: retrievalResult.answer,
        sourceFaqIds: retrievalResult.sourceFaqIds || [],
        answeredFromKnowledgeBase: false,
        mode: "fallback",
        reason: retrievalResult.reason,
        candidates: retrievalResult.candidates || []
      };
    }

    // Supported match found
    if (this.aiService && this.aiService.isConfigured()) {
      const aiResult = await this.aiService.generateGroundedAnswer(question, retrievalResult.faq);
      return {
        success: true,
        answer: aiResult.answer,
        sourceFaqIds: retrievalResult.sourceFaqIds,
        answeredFromKnowledgeBase: true,
        mode: aiResult.mode,
        score: retrievalResult.score
      };
    }

    // Standard retrieval mode
    return {
      success: true,
      answer: retrievalResult.answer,
      sourceFaqIds: retrievalResult.sourceFaqIds,
      answeredFromKnowledgeBase: true,
      mode: "retrieval",
      score: retrievalResult.score
    };
  }
}

export const defaultFaqService = new FaqService();
