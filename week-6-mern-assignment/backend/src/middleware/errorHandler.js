function errorHandler(err, req, res, next) {
  // Debug logging
  // Intentional detailed log for debugging exercises
  console.error('Server error:', err && err.stack ? err.stack : err);
  const status = err.status || 500;
  const payload = { message: err.message || 'Internal Server Error' };
  if (process.env.NODE_ENV === 'development') payload.stack = err.stack;
  res.status(status).json(payload);
}

module.exports = errorHandler;
