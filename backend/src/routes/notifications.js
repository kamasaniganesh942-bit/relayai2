const express = require('express');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/notifications — List notifications for authenticated user
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const userId = req.user.id;

  const { data, count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return errorResponse(res, 'Failed to fetch notifications.', 500);
  }

  return successResponse(res, data || [], 200, buildPagination(page, limit, count || 0));
});

// GET /api/notifications/unread-count — Get count of unread notifications
router.get('/unread-count', authenticate, async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    return errorResponse(res, 'Failed to count unread notifications.', 500);
  }

  return successResponse(res, { unreadCount: data ? data.length : 0 });
});

// PUT /api/notifications/:id/read — Mark single notification as read
router.put('/:id/read', authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update notification.', 500);
  }

  return successResponse(res, data);
});

// PUT /api/notifications/read-all — Mark all user notifications as read
router.put('/read-all', authenticate, async (req, res) => {
  const userId = req.user.id;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    return errorResponse(res, 'Failed to mark notifications as read.', 500);
  }

  return successResponse(res, { message: 'All notifications marked as read.' });
});

module.exports = router;

