import { Router } from 'express';
import etag from 'etag';
import { db } from '../db.js';
import { ok, fail, toInt } from '../utils.js';
import { validateCreate, validateUpdate } from '../schema.js';
import { cachePublic } from '../middleware/cache.js';

const router = Router();

/**
 * GET /api/inventory
 * Query: page, limit, search, fields
 * Performance: pagination, optional field selection, cache headers, ETag
 */
router.get('/', cachePublic(30), (req, res) => {
  const page = toInt(req.query.page, 1);
  const limit = toInt(req.query.limit, 10);
  const search = req.query.search || '';
  const fields = req.query.fields || null;

  const result = db.list({ page, limit, search, fields });
  const payload = ok(result.data, result.meta);
  const tag = etag(JSON.stringify(payload));

  if (req.headers['if-none-match'] === tag) {
    return res.status(304).end();
  }

  res.set('ETag', tag);
  res.json(payload);
});

/**
 * GET /api/inventory/:id
 */
router.get('/:id', cachePublic(60), (req, res) => {
  const item = db.get(req.params.id);
  if (!item) return res.status(404).json(fail('Item not found', null, 404));
  res.json(ok(item));
});

/**
 * POST /api/inventory
 * Body: { name, sku, quantity, location }
 */
router.post('/', (req, res) => {
  const errors = validateCreate(req.body);
  if (errors.length) return res.status(422).json(fail('Validation failed', errors, 422));
  const item = db.create(req.body);
  res.status(201).json(ok(item));
});

/**
 * PATCH /api/inventory/:id
 */
router.patch('/:id', (req, res) => {
  const errors = validateUpdate(req.body);
  if (errors.length) return res.status(422).json(fail('Validation failed', errors, 422));

  const updated = db.update(req.params.id, req.body);
  if (!updated) return res.status(404).json(fail('Item not found', null, 404));
  res.json(ok(updated));
});

/**
 * DELETE /api/inventory/:id
 */
router.delete('/:id', (req, res) => {
  const removed = db.remove(req.params.id);
  if (!removed) return res.status(404).json(fail('Item not found', null, 404));
  res.status(204).end();
});

export default router;
