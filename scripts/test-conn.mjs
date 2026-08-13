import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    envVars[key] = val;
  }
});

console.log('--- SUPABASE ENV CHECK ---');
console.log('NEXT_PUBLIC_SUPABASE_URL:', envVars['NEXT_PUBLIC_SUPABASE_URL']);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']);
console.log('--- PAYOS ENV CHECK ---');
console.log('PAYOS_CLIENT_ID:', envVars['PAYOS_CLIENT_ID']);
console.log('PAYOS_API_KEY:', envVars['PAYOS_API_KEY'] ? '***' + envVars['PAYOS_API_KEY'].slice(-4) : 'MISSING');
console.log('PAYOS_CHECKSUM_KEY:', envVars['PAYOS_CHECKSUM_KEY'] ? '***' + envVars['PAYOS_CHECKSUM_KEY'].slice(-4) : 'MISSING');
