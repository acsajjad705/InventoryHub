export function ok(data, meta) {
  return { data, meta: meta || null, error: null };
}

export function fail(message, details, status = 400) {
  return { data: null, meta: null, error: { message, details: details || null, status } };
}

export function toInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
