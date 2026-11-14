const { errorResponse } = require('../utils/helpers');

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required.', 401);
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'You do not have permission to perform this action.', 403);
    }
    next();
  };
}

module.exports = { authorize };
