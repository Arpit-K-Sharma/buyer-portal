const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { seed } = require('./seed');

async function autoSetup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not defined in .env');
    return;
  }

  // Parse connection string to get details without the 'buyer_portal' db
  const url = new URL(connectionString);
  const targetDb = url.pathname.slice(1);
  url.pathname = '/postgres'; // Connect to default db first

  const defaultClient = new Client({ connectionString: url.toString() });

  try {
    await defaultClient.connect();
    
    // Check if target database exists
    const res = await defaultClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDb]);
    
    if (res.rowCount === 0) {
      console.log(`\n🚀 Database "${targetDb}" not found. Creating it automatically...`);
      // Cannot use parameterized query for CREATE DATABASE
      await defaultClient.query(`CREATE DATABASE ${targetDb}`);
      console.log(`✅ Database "${targetDb}" created successfully.`);

      // Now close this connection and connect to the new DB to run schema
      await defaultClient.end();
      
      const newDbClient = new Client({ connectionString });
      await newDbClient.connect();

      console.log('📄 Running schema.sql...');
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await newDbClient.query(schemaSql);
      console.log('✅ Schema tables created.');
      
      await newDbClient.end();

      // Run Seed
      await seed();
    } else {
      console.log(`✅ Auto-setup: Database "${targetDb}" already exists.`);
      await defaultClient.end();
    }
  } catch (err) {
    console.error('\n❌ Auto-setup failed:', err.message);
    if (err.message.includes('authentication failed')) {
      console.error('------------------------------------------------------------');
      console.error('⚠️ IMPORTANT: Your PostgreSQL password in backend/.env is incorrect.');
      console.error(`   Please edit backend/.env and put the real password for user "${url.username}".`);
      console.error('------------------------------------------------------------\n');
    }
    process.exit(-1);
  }
}

module.exports = autoSetup;
