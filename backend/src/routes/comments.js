const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createCommentSchema, updateCommentSchema } = require('../validators/comments');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/comments — List comments for an entity
router.get('/', authenticate, async (req, res) => {
  const { entityType, entityId } = req.query;
  if (!entityType || !entityId) {
    return errorResponse(res, 'entityType and entityId query params are required.', 400);
  }

  const { page, limit, offset } = parsePagination(req.query);

  const { data, error, count } = await supabase
    .from('comments')
    .select('*, users(id, first_name, last_name, avatar_url)', { count: 'exact' })
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    return errorResponse(res, 'Failed to fetch comments.', 500);
  }

  return successResponse(res, data, 200, buildPagination(page, limit, count || 0));
});

// POST /api/comments — Create comment
router.post('/', authenticate, validate(createCommentSchema), async (req, res) => {
  const { entityType, entityId, content } = req.body;

  const { data, error } = await supabase.from('comments').insert({
    id: uuidv4(),
    entity_type: entityType,
    entity_id: entityId,
    user_id: req.user.id,
    content,
  }).select('*, users(id, first_name, last_name, avatar_url)').single();

  if (error) {
    return errorResponse(res, 'Failed to create comment.', 500);
  }

  return successResponse(res, data, 201);
});

// PUT /api/comments/:id — Update comment
router.put('/:id', authenticate, validate(updateCommentSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('comments')
    .update({ content: req.body.content })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id) // Only own comments
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update comment. You can only edit your own comments.', 403);
  }

  return successResponse(res, data);
});

// DELETE /api/comments/:id — Delete comment
router.delete('/:id', authenticate, async (req, res) => {
  // Allow deletion of own comments, or admin can delete any
  let query = supabase.from('comments').delete().eq('id', req.params.id);

  if (!['super_admin', 'org_admin'].includes(req.user.role)) {
    query = query.eq('user_id', req.user.id);
  }

  const { error } = await query;

  if (error) {
    return errorResponse(res, 'Failed to delete comment.', 500);
  }

  return successResponse(res, { message: 'Comment deleted successfully.' });
});

module.exports = router;
