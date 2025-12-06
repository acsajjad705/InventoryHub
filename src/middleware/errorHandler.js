import { fail } from '../utils.js';

export default function errorHandler(err, req, res, next) {
  console.error('[Error]', err);
  const status = err.status || 500;
  res.status(status).json(fail('Internal server error', process.env.NODE_ENV === 'production' ? null : err.message, status));
}
