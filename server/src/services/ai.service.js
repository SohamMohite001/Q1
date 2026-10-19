/**
 * AI Service for grounded answer generation using Nemotron (or compatible OpenAI-format API).
 * Never invents facts; strictly grounded on retrieved FAQ context.
 */

export class AiService {
  constructor(config = {}) {
    this.enabled = config.enabled ?? (process.env.AI_ENABLED === "true");
    this.apiKey = config.apiKey ?? process.env.NEMOTRON_API_KEY ?? process.env.HF_API_KEY ?? "";
    this.baseUrl = config.baseUrl ?? process.env.NEMOTRON_BASE_URL ?? process.env.HF_BASE_URL ?? "https://router.huggingface.co/hf-inference/v1";
    this.model = config.model ?? process.env.NEMOTRON_MODEL ?? process.env.HF_MODEL ?? "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF";
    this.timeoutMs = config.timeoutMs ?? parseInt(process.env.AI_TIMEOUT_MS || "20000", 10);
  }

  /**
   * Checks whether the AI provider is properly configured and enabled.
   */
  isConfigured() {
    return this.enabled && Boolean(this.apiKey) && Boolean(this.baseUrl);
  }

  /**
   * Generates a grounded response based solely on the retrieved FAQ.
   * If AI is disabled, unconfigured, or fails, gracefully falls back to the verified FAQ answer.
   *
   * @param {string} userQuestion
   * @param {Object} matchedFaq - The retrieved FAQ object ({ id, question, answer, category })
   * @returns {Promise<{ answer: string, mode: "retrieval" | "ai", aiFallback?: boolean }>}
   */
  async generateGroundedAnswer(userQuestion, matchedFaq) {
    // If matchedFaq is missing, NEVER invoke AI
    if (!matchedFaq || !matchedFaq.answer) {
      throw new Error("Cannot invoke AI service without verified FAQ context.");
    }

    if (!this.isConfigured()) {
      return {
        answer: matchedFaq.answer,
        mode: "retrieval"
      };
    }

    const systemPrompt = `You are a polite, accurate AI assistant for a college department.
CRITICAL RULES:
1. Answer the user's question using ONLY the provided verified FAQ context.
2. Do NOT invent, assume, or extrapolate any dates, fees, contact numbers, or policies not explicitly written in the context.
3. If the context does not answer the question, state that the information is unavailable.
4. Keep the answer direct, concise, and professional.`;

    const userPrompt = `Verified FAQ Context:
[Category: ${matchedFaq.category}]
[Question: ${matchedFaq.question}]
[Answer: ${matchedFaq.answer}]

User Question: ${userQuestion}

Please provide a helpful, natural response using solely the verified answer above.`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);

      const endpoint = `${this.baseUrl.replace(/\/+$/, "")}/chat/completions`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 300
        }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        console.warn(`[AiService] Provider returned HTTP ${response.status}. Falling back to verified FAQ answer.`);
        return {
          answer: matchedFaq.answer,
          mode: "retrieval",
          aiFallback: true
        };
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim();

      if (!content || typeof content !== "string" || content.length < 5) {
        console.warn("[AiService] Provider returned empty or invalid content. Falling back to verified FAQ answer.");
        return {
          answer: matchedFaq.answer,
          mode: "retrieval",
          aiFallback: true
        };
      }

      return {
        answer: content,
        mode: "ai"
      };
    } catch (err) {
      console.warn(`[AiService] AI request failed (${err.name || "Error"}: ${err.message}). Safely returning retrieval answer.`);
      return {
        answer: matchedFaq.answer,
        mode: "retrieval",
        aiFallback: true
      };
    }
  }
}

export const defaultAiService = new AiService();
