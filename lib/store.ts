import { Pool } from 'pg';
import { PortfolioRecord } from '@/lib/types';

const memoryStore = new Map<string, PortfolioRecord>();

const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;

let dbInitialized = false;

async function initDb() {
  if (!pool || dbInitialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolios (
      subdomain TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  dbInitialized = true;
}

export async function savePortfolio(record: PortfolioRecord) {
  if (!pool) {
    memoryStore.set(record.subdomain, record);
    return;
  }

  await initDb();
  await pool.query(
    `INSERT INTO portfolios (subdomain, payload)
     VALUES ($1, $2)
     ON CONFLICT (subdomain)
     DO UPDATE SET payload = EXCLUDED.payload, created_at = NOW();`,
    [record.subdomain, JSON.stringify(record)]
  );
}

export async function getPortfolio(subdomain: string): Promise<PortfolioRecord | null> {
  if (!pool) {
    return memoryStore.get(subdomain) ?? null;
  }

  await initDb();
  const result = await pool.query('SELECT payload FROM portfolios WHERE subdomain = $1 LIMIT 1', [subdomain]);
  return result.rows[0]?.payload ?? null;
}
