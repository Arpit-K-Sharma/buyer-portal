/**
 * Global error handler middleware.
 * Must be registered LAST in Express (after all routes).
 * All errors thrown via next(err) funnel through here.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // PostgreSQL unique violation (e.g., duplicate email or duplicate favourite)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with this value already exists.' });
  }

  // PostgreSQL foreign key violation (e.g., property doesn't exist)
  if (err.code === '23503') {
    return res.status(404).json({ error: 'Referenced resource not found.' });
  }

  // Custom application errors with explicit status
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Default: 500 Internal Server Error
  res.status(500).json({ error: 'Something went wrong. Please try again later.' });
};

/**
 * Helper to create an error with an HTTP status attached.
 * Usage: throw createError(404, 'Property not found')
 */
const createError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

module.exports = { errorHandler, createError };
