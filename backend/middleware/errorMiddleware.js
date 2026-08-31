// ====================
// 404 Handler
// ====================

function notFoundHandler(req, res) {
  return res.status(404).json({
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

// ====================
// Global Error Handler
// ====================

function errorHandler(
  error,
  req,
  res,
  next,
) {
  console.error(
    'Global server error:',
    error,
  )

  return res.status(500).json({
    message:
      'خطای داخلی سرور.',
  })
}

module.exports = {
  notFoundHandler,
  errorHandler,
}