export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(err, req, res, next) {
  // Handle JSON parsing syntax errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Malformed JSON payload in request body"
    });
  }

  // Handle payload too large
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      error: "Request entity too large"
    });
  }

  // Log error internally (without secrets)
  console.error(`[UnhandledError] ${err.name || "Error"}: ${err.message}`);

  // Never leak internal stack traces to the client
  res.status(err.status || 500).json({
    success: false,
    error: "An internal server error occurred. Please try again later."
  });
}
