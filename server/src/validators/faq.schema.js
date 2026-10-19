import { z } from "zod";

export const ALLOWED_CATEGORIES = [
  "Admissions",
  "Courses and Eligibility",
  "Fees and Scholarships",
  "Examinations",
  "Library and Facilities",
  "Placements and Career Support",
  "Department Contact and Student Support"
];

export const faqItemSchema = z.object({
  id: z.string().trim().regex(/^FAQ\d{3,}$/, {
    message: "FAQ ID must follow the format 'FAQ' followed by at least 3 digits (e.g. FAQ001)"
  }),
  category: z.enum(ALLOWED_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}` })
  }),
  question: z.string().trim().min(5, "Question must be at least 5 characters").max(300, "Question cannot exceed 300 characters"),
  answer: z.string().trim().min(10, "Answer must be at least 10 characters").max(1000, "Answer cannot exceed 1000 characters"),
  keywords: z.array(z.string().trim().min(1, "Keywords cannot be empty strings")).min(1, "Each FAQ must have at least one keyword")
});

export const metadataSchema = z.object({
  title: z.string().trim().min(1, "Metadata title is required"),
  department: z.string().trim().optional(),
  dataType: z.literal("sample"),
  verified: z.boolean(),
  version: z.string().trim().optional(),
  disclaimer: z.string().trim().min(1, "Metadata disclaimer is required"),
  description: z.string().trim().optional()
});

export const faqKnowledgeBaseSchema = z.object({
  metadata: metadataSchema,
  faqs: z.array(faqItemSchema).min(25, "Knowledge base must contain at least 25 FAQs")
}).superRefine((data, ctx) => {
  const seenIds = new Set();
  const seenQuestions = new Set();

  data.faqs.forEach((faq, index) => {
    if (seenIds.has(faq.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate FAQ ID detected: '${faq.id}' at index ${index}`,
        path: ["faqs", index, "id"]
      });
    }
    seenIds.add(faq.id);

    const normalizedQuestion = faq.question.toLowerCase().trim();
    if (seenQuestions.has(normalizedQuestion)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate FAQ question detected at index ${index}: "${faq.question}"`,
        path: ["faqs", index, "question"]
      });
    }
    seenQuestions.add(normalizedQuestion);
  });
});

export const askQuestionSchema = z.object({
  question: z.string({
    required_error: "Question is required",
    invalid_type_error: "Question must be a string"
  })
    .trim()
    .min(1, "Question cannot be empty")
    .max(500, "Question cannot exceed 500 characters")
});
