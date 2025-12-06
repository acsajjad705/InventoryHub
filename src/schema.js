export function validateCreate(body) {
  const errors = [];
  if (!body || typeof body !== 'object') errors.push('Body must be a JSON object.');
  if (!body?.name) errors.push('name is required.');
  if (!body?.sku) errors.push('sku is required.');
  if (typeof body?.quantity !== 'number' || body.quantity < 0) errors.push('quantity must be a non-negative number.');
  if (!body?.location) errors.push('location is required.');
  return errors;
}

export function validateUpdate(body) {
  const errors = [];
  if (!body || typeof body !== 'object') errors.push('Body must be a JSON object.');
  if ('quantity' in body && (typeof body.quantity !== 'number' || body.quantity < 0)) {
    errors.push('quantity must be a non-negative number.');
  }
  return errors;
}
