function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'Request body too large.' });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, error: 'File size exceeds the limit.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error.'
      : err.message || 'Internal server error.';

  res.status(statusCode).json({ success: false, error: message });
}

module.exports = { errorHandler };
