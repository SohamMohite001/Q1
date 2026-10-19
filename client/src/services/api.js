/**
 * Centralized API service for communicating with the college chatbot backend.
 */

const API_BASE = "/api";

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error(`Health check failed (HTTP ${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("[API] checkHealth error:", err);
    throw err;
  }
}

export async function fetchFaqList() {
  try {
    const res = await fetch(`${API_BASE}/faq/list`, {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error(`Failed to fetch FAQs (HTTP ${res.status})`);
    return await res.json();
  } catch (err) {
    console.error("[API] fetchFaqList error:", err);
    throw err;
  }
}

export async function askQuestion(question) {
  const trimmed = (question || "").trim();
  if (!trimmed) {
    throw new Error("Question cannot be empty.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${API_BASE}/faq/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ question: trimmed }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMessage = data?.error || data?.details?.[0]?.message || `Server error (HTTP ${res.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Request timed out. The server took too long to respond. Please check your connection and try again.");
    }
    throw err;
  }
}
