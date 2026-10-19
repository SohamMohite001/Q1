/**
 * Retrieval Service for College FAQ Chatbot.
 * Independent, deterministic, zero heavy ML dependencies.
 */

export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "can't", "cannot", "could",
  "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
  "during", "each", "few", "for", "from", "further", "had", "hadn't", "has",
  "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her",
  "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
  "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
  "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
  "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
  "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't",
  "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
  "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
  "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
  "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
  "what's", "when", "when's", "where", "where's", "which", "while", "who",
  "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you",
  "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
  "please", "tell", "give", "know", "want", "like", "need", "get", "inform",
  "information", "regarding", "related"
]);

/**
 * Normalizes text: trims, lowercases, removes punctuation.
 */
export function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Basic stemming / lemmatization for common English words used in college queries.
 */
export function stemToken(token) {
  if (!token || token.length <= 3) return token;
  if (token.endsWith("ies")) return token.slice(0, -3) + "y"; // libraries -> library
  if (token.endsWith("ses") || token.endsWith("xes")) return token.slice(0, -2);
  if (token.endsWith("ing")) return token.slice(0, -3); // applying -> apply
  if (token.endsWith("ed")) return token.slice(0, -2); // required -> requir
  if (token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1); // admissions -> admission
  return token;
}

export const SYNONYMS = {
  procedure: "process",
  steps: "process",
  guideline: "guidelines",
  charges: "fee",
  tuition: "fee",
  joining: "join",
  entrance: "admission",
  qualifications: "eligibility"
};

/**
 * Tokenizes text and removes stop words.
 */
export function tokenize(text, removeStopWords = true) {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(t => t.length > 0);
  if (!removeStopWords) return tokens;

  return tokens
    .filter(token => !STOP_WORDS.has(token))
    .map(stemToken)
    .map(token => SYNONYMS[token] || token)
    .filter(token => token.length > 1);
}

/**
 * Evaluates candidate match score between a user query and an FAQ item.
 */
export function scoreFaq(query, faq) {
  const normQuery = normalizeText(query);
  const normQuestion = normalizeText(faq.question);

  // 1. Exact match check
  if (normQuery === normQuestion) {
    return {
      score: 1.0,
      matchType: "exact_match",
      matchedKeywords: faq.keywords
    };
  }

  // 2. Exact substring match
  if (normQuestion.includes(normQuery) && normQuery.length > 15) {
    return {
      score: 0.95,
      matchType: "exact_substring",
      matchedKeywords: []
    };
  }

  const queryTokens = tokenize(query);
  const questionTokens = tokenize(faq.question);

  if (queryTokens.length === 0) {
    return { score: 0, matchType: "none", matchedKeywords: [] };
  }

  // 3. Question Token Overlap (Jaccard-like with coverage weighting)
  const questionTokenSet = new Set(questionTokens);
  let tokenMatches = 0;
  for (const token of queryTokens) {
    if (questionTokenSet.has(token)) {
      tokenMatches++;
    }
  }

  const queryCoverage = tokenMatches / queryTokens.length;
  const questionCoverage = questionTokens.length > 0 ? tokenMatches / questionTokens.length : 0;
  const tokenOverlapScore = (queryCoverage * 0.7) + (questionCoverage * 0.3);

  // 4. Keyword Matching
  const matchedKeywords = [];
  let keywordScoreAccumulator = 0;

  for (const rawKw of faq.keywords) {
    const normKw = normalizeText(rawKw);
    if (!normKw) continue;

    // Check multi-word keyword in normalized query
    if (normKw.includes(" ")) {
      if (normQuery.includes(normKw)) {
        matchedKeywords.push(rawKw);
        keywordScoreAccumulator += 1.5; // High weight for multi-word exact phrases
      }
    } else {
      // Check single word keyword
      const stemmedKw = stemToken(normKw);
      if (queryTokens.includes(stemmedKw) || queryTokens.includes(normKw)) {
        matchedKeywords.push(rawKw);
        keywordScoreAccumulator += 1.0;
      }
    }
  }

  const keywordCoverage = faq.keywords.length > 0
    ? Math.min(1.0, keywordScoreAccumulator / Math.max(2, Math.min(faq.keywords.length, 4)))
    : 0;

  // Single word guard: if only 1 token matches and query has 3+ tokens, prevent false positives
  if (tokenMatches <= 1 && matchedKeywords.length <= 1 && queryTokens.length >= 3) {
    return { score: 0.15, matchType: "insufficient_matches", matchedKeywords };
  }

  // Calculate composite score
  const compositeScore = (tokenOverlapScore * 0.45) + (keywordCoverage * 0.55);
  const finalScore = Math.min(1.0, Math.round(compositeScore * 1000) / 1000);

  return {
    score: finalScore,
    matchType: finalScore >= 0.30 ? "relevant" : "weak",
    matchedKeywords
  };
}

/**
 * Retrieves the best matching FAQ from the knowledge base for a query.
 *
 * @param {string} query - The user question
 * @param {Array} faqs - Array of FAQ items
 * @param {Object} options - Configuration options (threshold, ambiguity delta)
 */
export function retrieveAnswer(query, faqs, options = {}) {
  const minThreshold = options.threshold ?? 0.30;
  const ambiguityDelta = options.ambiguityDelta ?? 0.06;

  if (!query || typeof query !== "string" || !Array.isArray(faqs) || faqs.length === 0) {
    return {
      matched: false,
      reason: "invalid_input",
      answer: null,
      sourceFaqIds: [],
      score: 0
    };
  }

  // Check prompt injection or instruction override patterns
  const normalized = normalizeText(query);
  const injectionPatterns = [
    "ignore all previous instructions",
    "ignore above instructions",
    "system prompt",
    "developer mode",
    "disregard previous",
    "pretend you are"
  ];
  for (const pattern of injectionPatterns) {
    if (normalized.includes(pattern)) {
      return {
        matched: false,
        reason: "injection_attempt",
        answer: "Sorry, I couldn't find this information in the available college FAQ knowledge base. Please contact the college department for assistance.",
        sourceFaqIds: [],
        score: 0
      };
    }
  }

  // Score all FAQs
  const scoredCandidates = faqs.map(faq => {
    const { score, matchType, matchedKeywords } = scoreFaq(query, faq);
    return {
      faq,
      score,
      matchType,
      matchedKeywords
    };
  });

  // Sort descending by score
  scoredCandidates.sort((a, b) => b.score - a.score);

  const topCandidate = scoredCandidates[0];
  const secondCandidate = scoredCandidates[1];

  // If top candidate doesn't meet minimum relevance threshold
  if (!topCandidate || topCandidate.score < minThreshold) {
    return {
      matched: false,
      reason: "no_relevant_match",
      answer: "Sorry, I couldn't find this information in the available college FAQ knowledge base. Please contact the college department for assistance.",
      sourceFaqIds: [],
      score: topCandidate ? topCandidate.score : 0,
      candidates: []
    };
  }

  // Ambiguity check: if 2nd candidate is close to top candidate and top is not an exact match
  if (
    secondCandidate &&
    secondCandidate.score >= minThreshold &&
    (topCandidate.score - secondCandidate.score) <= ambiguityDelta &&
    topCandidate.score < 0.90
  ) {
    return {
      matched: false,
      reason: "ambiguous",
      answer: `Your question appears related to multiple topics: "${topCandidate.faq.question}" or "${secondCandidate.faq.question}". Please rephrase your question with more specific details.`,
      sourceFaqIds: [topCandidate.faq.id, secondCandidate.faq.id],
      score: topCandidate.score,
      candidates: [
        { id: topCandidate.faq.id, question: topCandidate.faq.question, score: topCandidate.score },
        { id: secondCandidate.faq.id, question: secondCandidate.faq.question, score: secondCandidate.score }
      ]
    };
  }

  // Confident match found
  return {
    matched: true,
    reason: "match_found",
    answer: topCandidate.faq.answer,
    sourceFaqIds: [topCandidate.faq.id],
    score: topCandidate.score,
    faq: topCandidate.faq,
    matchedKeywords: topCandidate.matchedKeywords
  };
}
