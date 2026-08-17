import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in environment variables.');
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY) are set in your env / GitHub secrets.');
  process.exit(1);
}

export const config = {
  supabaseUrl: SUPABASE_URL,
  supabaseServiceKey: SUPABASE_SERVICE_KEY,
  kvikboligEmail: process.env.KVIKBOLIG_EMAIL || 'lucasgarrone4@gmail.com',
  kvikboligPassword: process.env.KVIKBOLIG_PASSWORD || 'Futbolteamo#2',
};
