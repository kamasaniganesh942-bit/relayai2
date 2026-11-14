const { ZodError } = require('zod');
const { errorResponse } = require('../utils/helpers');

function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        return errorResponse(res, `Validation failed: ${messages.join('; ')}`, 400);
      }
      next(err);
    }
  };
}

module.exports = { validate };
