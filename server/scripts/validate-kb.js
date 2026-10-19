import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { faqKnowledgeBaseSchema } from "../src/validators/faq.schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const kbPath = path.resolve(__dirname, "../kb/faqs.json");

console.log("==================================================");
console.log("🔍 Validating College FAQ Knowledge Base Schema...");
console.log(`📁 Knowledge Base Path: ${kbPath}`);

try {
  if (!fs.existsSync(kbPath)) {
    console.error(`❌ Error: Knowledge base file not found at ${kbPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(kbPath, "utf-8");
  const json = JSON.parse(rawData);

  const result = faqKnowledgeBaseSchema.safeParse(json);

  if (!result.success) {
    console.error("❌ Knowledge Base Validation Failed!");
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  const validData = result.data;
  console.log("✅ Knowledge Base Schema is VALID!");
  console.log(`📊 Total FAQs: ${validData.faqs.length}`);
  console.log(`🏷️  Data Type: ${validData.metadata.dataType} (verified: ${validData.metadata.verified})`);
  console.log(`⚠️  Disclaimer: "${validData.metadata.disclaimer}"`);

  // Category counts
  const categoryCounts = {};
  for (const faq of validData.faqs) {
    categoryCounts[faq.category] = (categoryCounts[faq.category] || 0) + 1;
  }

  console.log("\n📋 FAQ Count by Category:");
  for (const [cat, count] of Object.entries(categoryCounts)) {
    console.log(`   - ${cat}: ${count}`);
  }
  console.log("==================================================");
  process.exit(0);
} catch (err) {
  console.error("❌ Unexpected error during validation:", err.message);
  process.exit(1);
}
