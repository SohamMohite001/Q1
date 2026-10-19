# College FAQ Chatbot REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Health Check

Checks if the backend API service is online and healthy.

- **Method:** `GET`
- **Endpoint:** `/health`
- **Headers:** `Accept: application/json`

### Success Response (`200 OK`)
```json
{
  "status": "ok",
  "service": "college-faq-chatbot-api",
  "timestamp": "2026-10-19T13:45:00.000Z",
  "uptimeSeconds": 142
}
```

---

## 2. List Knowledge Base FAQs

Returns the full list of validated FAQs along with dataset metadata.

- **Method:** `GET`
- **Endpoint:** `/faq/list`
- **Headers:** `Accept: application/json`

### Success Response (`200 OK`)
```json
{
  "success": true,
  "count": 34,
  "metadata": {
    "title": "College Department FAQ Knowledge Base",
    "department": "Department of Computer Science & Engineering",
    "dataType": "sample",
    "verified": false,
    "version": "1.0.0",
    "disclaimer": "SAMPLE DATA — NOT VERIFIED COLLEGE INFORMATION. All answers provided are illustrative for academic demonstration and do not reflect real institutional deadlines, fees, or policies.",
    "description": "Structured FAQ knowledge base for college practical assignment testing and demonstration."
  },
  "faqs": [
    {
      "id": "FAQ001",
      "category": "Admissions",
      "question": "How can I apply for admission to the college?",
      "answer": "Admission applications must be submitted through the official state centralized admission counseling portal or through the college admissions desk during the official admission cycle. Candidates should verify the formal prospectus on the institutional website.",
      "keywords": [
        "apply",
        "admission",
        "application",
        "form",
        "portal",
        "process",
        "procedure",
        "register",
        "join",
        "enrollment"
      ]
    }
  ]
}
```

---

## 3. Ask a Question

Queries the knowledge base using the deterministic retrieval engine (and optional grounded AI).

- **Method:** `POST`
- **Endpoint:** `/faq/ask`
- **Headers:** 
  - `Content-Type: application/json`
  - `Accept: application/json`

### Request Body
```json
{
  "question": "How can I apply for admission to the college?"
}
```

### Constraints:
- `question`: Required, non-empty string, maximum 500 characters.

### Responses

#### A. Supported Question (`200 OK`)
```json
{
  "success": true,
  "answer": "Admission applications must be submitted through the official state centralized admission counseling portal or through the college admissions desk during the official admission cycle. Candidates should verify the formal prospectus on the institutional website.",
  "sourceFaqIds": [
    "FAQ001"
  ],
  "answeredFromKnowledgeBase": true,
  "mode": "retrieval",
  "score": 1.0
}
```

#### B. Unsupported Question (`200 OK`)
```json
{
  "success": true,
  "answer": "Sorry, I couldn't find this information in the available college FAQ knowledge base. Please contact the college department for assistance.",
  "sourceFaqIds": [],
  "answeredFromKnowledgeBase": false,
  "mode": "fallback",
  "reason": "no_relevant_match",
  "candidates": []
}
```

#### C. Ambiguous Question (`200 OK`)
```json
{
  "success": true,
  "answer": "Your question appears related to multiple topics: \"How can I apply for admission to the college?\" or \"Is there an institutional or management quota available for admissions?\". Please rephrase your question with more specific details.",
  "sourceFaqIds": [
    "FAQ001",
    "FAQ004"
  ],
  "answeredFromKnowledgeBase": false,
  "mode": "fallback",
  "reason": "ambiguous"
}
```

#### D. Validation Error (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Invalid request payload",
  "details": [
    {
      "field": "question",
      "message": "Question cannot be empty"
    }
  ]
}
```

#### E. Malformed JSON (`400 Bad Request`)
```json
{
  "success": false,
  "error": "Malformed JSON payload in request body"
}
```

#### F. Unknown Route (`404 Not Found`)
```json
{
  "success": false,
  "error": "Resource not found: GET /api/nonexistent"
}
```

---

## 4. Example PowerShell Calls

```powershell
# Health Check
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get

# Ask a Supported Question
$body = @{ question = "What documents are required during admission verification?" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/faq/ask" -Method Post -ContentType "application/json" -Body $body

# Ask an Unsupported Question
$unsupportedBody = @{ question = "Can students park private airplanes on campus?" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/faq/ask" -Method Post -ContentType "application/json" -Body $unsupportedBody
```
