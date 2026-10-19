import { Router } from "express";
import { defaultFaqService } from "../services/faq.service.js";
import { validateBody } from "../middleware/validate.js";
import { askQuestionSchema } from "../validators/faq.schema.js";

const router = Router();

/**
 * Health check endpoint.
 * GET /api/health
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "college-faq-chatbot-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

/**
 * List all FAQs with metadata.
 * GET /api/faq/list
 */
router.get("/faq/list", (req, res) => {
  const result = defaultFaqService.getFaqList();
  res.status(200).json(result);
});

/**
 * Ask a question against the FAQ knowledge base.
 * POST /api/faq/ask
 */
router.post("/faq/ask", validateBody(askQuestionSchema), async (req, res, next) => {
  try {
    const { question } = req.validatedBody;
    const response = await defaultFaqService.answerQuestion(question);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
