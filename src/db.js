import { v4 as uuid } from 'uuid';

const items = [
  // Example seed
  { id: uuid(), name: 'Laptop', sku: 'LAP-001', quantity: 12, location: 'Warehouse A', updatedAt: new Date().toISOString() },
  { id: uuid(), name: 'Mouse', sku: 'MOU-101', quantity: 58, location: 'Warehouse B', updatedAt: new Date().toISOString() }
];

export const db = {
  list({ page = 1, limit = 10, search = '', fields }) {
    const offset = (page - 1) * limit;
    const filtered = search
      ? items.filter(i => (i.name + i.sku + i.location).toLowerCase().includes(search.toLowerCase()))
      : items;

    const pageItems = filtered.slice(offset, offset + limit);
    const data = fields ? pageItems.map(i => pickFields(i, fields)) : pageItems;

    return {
      data,
      meta: { page, limit, total: filtered.length }
    };
  },

  get(id) {
    return items.find(i => i.id === id) || null;
  },

  create({ name, sku, quantity, location }) {
    const item = { id: uuid(), name, sku, quantity, location, updatedAt: new Date().toISOString() };
    items.unshift(item);
    return item;
  },

  update(id, patch) {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch, updatedAt: new Date().toISOString() };
    return items[idx];
  },

  remove(id) {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    return true;
  }
};

function pickFields(obj, fields) {
  const f = Array.isArray(fields) ? fields : String(fields).split(',').map(s => s.trim()).filter(Boolean);
  return f.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}
