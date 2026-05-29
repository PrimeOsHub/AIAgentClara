import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const fallbackKeyPath = path.resolve(process.cwd(), '..', 'credentials', 'openai_project_api_key.env');
if (!process.env.OPENAI_API_KEY && fs.existsSync(fallbackKeyPath)) {
  const line = fs.readFileSync(fallbackKeyPath, 'utf8').trim();
  const match = line.match(/^OPENAI_API_KEY=(.+)$/);
  if (match) process.env.OPENAI_API_KEY = match[1];
}

export const env = {
  port: Number(process.env.PORT || 8787),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173',
  hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  model: process.env.OPENAI_MODEL || 'gpt-5.4-mini'
};
