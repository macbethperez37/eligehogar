const mysql = require('mysql2/promise');

let dbConnection = null;

const connectDB = async () => {
  try {
    dbConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'luxe_estate',
      port: process.env.MYSQL_PORT || 3306
    });
    
    console.log(`MySQL Connected: ${dbConnection.config.database}`);
    
    // Test the connection
    const [rows] = await dbConnection.execute('SELECT 1');
    if (rows) {
      console.log('Database connection test successful');
    }
    
    return dbConnection;
  } catch (error) {
    console.error(`MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const getDB = () => {
  if (!dbConnection) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return dbConnection;
};

module.exports = { connectDB, getDB };