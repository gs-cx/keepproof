import { Pool } from 'pg';

// Configuration explicite pour la production
const pool = new Pool({
  user: process.env.DB_USER || 'keepproof',
  password: process.env.DB_PASSWORD || 'password_securise',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  database: process.env.DB_NAME || 'keepproof',
  max: 20, // Augmenté pour supporter la charge
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('❌ [DB ERROR]', text, error);
    throw error;
  }
}

export default pool;
