import { createClient } from '@supabase/supabase-js';
import { config } from './config';

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function check() {
  const { data, error } = await supabase.from('listings').select('id, title, cpr_allowed, status').limit(3);
  if (error) {
    console.log('❌ Schema error:', error.message);
  } else {
    console.log('✅ Phase 2 columns exist in Supabase!');
    console.log('Sample rows:', data);
  }
}

check();
