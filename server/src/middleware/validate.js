export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error.errors.map(err => ({
        field: err.path.join("."),
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        error: "Invalid request payload",
        details: formattedErrors
      });
    }

    req.validatedBody = result.data;
    next();
  };
}
