# InventoryHub

A complete, optimized full-stack application demonstrating front-end/back-end integration, JSON structures, debugging, and performance improvements.

## Features
- REST API with consistent JSON envelopes (data/meta/error)
- Inventory CRUD with validation, pagination, ETag, and caching
- Accessible, responsive front-end integrated via Fetch API

## Getting started
1. npm install
2. npm run dev
3. Open http://localhost:3000

## API examples
- GET /api/inventory?page=1&limit=10&search=mouse&fields=id,name,quantity
- POST /api/inventory { name, sku, quantity, location }
- PATCH /api/inventory/:id { quantity: '+1' }
- DELETE /api/inventory/:id

## Copilot-assisted workflow (reflective summary)
- Generated scaffolding for Express routes and front-end fetch logic.
- Suggested response envelope structure (data/meta/error) for consistency.
- Aided in debugging CORS, JSON parsing, and pagination off-by-one issues.
- Proposed ETag + Cache-Control for conditional GET performance.
- Streamlined field selection with query parameters to reduce response size.

## License
MIT
