const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    // Connect to MySQL without database
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      port: process.env.MYSQL_PORT || 3306,
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // Read schema file
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema with multiple statements enabled
    try {
      await connection.query(schema);
      console.log('Database schema executed successfully!');
    } catch (error) {
      console.log(`Schema execution warning: ${error.message}`);
    }

    await connection.end();

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupDatabase();