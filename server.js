import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import inventoryRouter from './src/routes/inventory.js';
import errorHandler from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security + performance
app.use(helmet());
app.use(compression());
app.use(cors({ origin: true }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

// Static front-end
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/inventory', inventoryRouter);

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`InventoryHub running at http://localhost:${PORT}`);
});
