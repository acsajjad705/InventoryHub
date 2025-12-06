const express = require('express');
const router = express.Router();

// Sample in-memory data
let items = [
  { id: 1, name: "Laptop", quantity: 10 },
  { id: 2, name: "Mouse", quantity: 25 }
];

// GET all items
router.get('/', (req, res) => {
  res.json({ success: true, data: items });
});

// POST new item
router.post('/', (req, res) => {
  const { name, quantity } = req.body;
  const newItem = { id: items.length + 1, name, quantity };
  items.push(newItem);
  res.json({ success: true, data: newItem });
});

// PUT update item
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, quantity } = req.body;
  let item = items.find(i => i.id === id);
  if (item) {
    item.name = name || item.name;
    item.quantity = quantity || item.quantity;
    res.json({ success: true, data: item });
  } else {
    res.status(404).json({ success: false, message: "Item not found" });
  }
});

// DELETE item
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter(i => i.id !== id);
  res.json({ success: true, message: "Item deleted" });
});

module.exports = router;
