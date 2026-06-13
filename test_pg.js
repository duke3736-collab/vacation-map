const { Client } = require('pg');

async function testConnection() {
  const regions = [
    'ap-northeast-2', // Seoul
    'ap-northeast-1', // Tokyo
    'us-east-1',      // N. Virginia
    'us-west-1',      // N. California
    'us-west-2'       // Oregon
  ];

  for (const region of regions) {
    const cs = `postgresql://postgres.pjoakjbqlakczbhbhtxn:k3dbiNgey1647HGY@aws-0-${region}.pooler.supabase.com:6543/postgres`;
    console.log(`Trying ${cs}...`);
    const client = new Client({ connectionString: cs, connectionTimeoutMillis: 3000 });
    try {
      await client.connect();
      console.log('Connected successfully!');
      await client.end();
      return;
    } catch (err) {
      console.error(`Failed for ${region}:`, err.message);
    }
  }
}

testConnection();
