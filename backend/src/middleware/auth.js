const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');
const { errorResponse } = require('../utils/helpers');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. Please provide a valid token.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, org_id, email, first_name, last_name, role, avatar_url, is_active')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return errorResponse(res, 'User not found or token invalid.', 401);
    }

    if (!user.is_active) {
      return errorResponse(res, 'Account is deactivated. Contact your administrator.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please log in again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 401);
  }
}

module.exports = { authenticate };
