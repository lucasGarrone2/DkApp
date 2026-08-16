import { createClient } from '@supabase/supabase-js';
import { config } from './config';

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function cleanDatabase() {
  console.log('🧹 Cleaning fake non-housing rows from Supabase...');
  const { data, error } = await supabase
    .from('listings')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

  if (error) {
    console.error('❌ Error cleaning database:', error);
  } else {
    console.log('✅ Database cleaned successfully!');
  }
}

cleanDatabase();
