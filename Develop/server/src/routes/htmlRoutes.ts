import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
app.get('/index.html', (_req, res) => res.sendFile(path.join(__dirname, '/Users/adityabhonsle/Desktop/challenges/weather-dashboard/Develop/server/src/routes/index.ts')));
AudioPa
export default router;
