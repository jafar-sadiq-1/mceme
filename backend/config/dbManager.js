const mongoose = require('mongoose');
require('dotenv').config();

// Store connections in module scope
const connections = new Map();
const baseUri = process.env.MONGODB_URI;
const baseUrl = baseUri.substring(0, baseUri.lastIndexOf('/'));

// Validate financial year format
const validateFinancialYear = (year) => {
  const pattern = /^FY\d{4}-\d{4}$/;
  if (!pattern.test(year)) {
    throw new Error('Year must be in format FY2024-2025');
  }
  const [startYear, endYear] = year.slice(2).split('-').map(Number);
  if (endYear !== startYear + 1) {
    throw new Error('Invalid financial year range');
  }
};

// Get connection for specific financial year
const getConnection = async (financialYear) => {
  // Creates database name like: mceme_FY2023-2024
  const dbName = `mceme_${financialYear}`;
  
  // Check if connection exists in cache
  if (connections.has(dbName)) {
    console.log(`connected to database ${dbName}`);
    return connections.get(dbName);
  }

  // Create new connection for specific financial year
  const connection = await mongoose.createConnection(
    `${baseUrl}/${dbName}?retryWrites=true&w=majority`
  );
  
  // Cache the connection
  connections.set(dbName, connection);
  console.log(`connected to database ${dbName}`);
  return connection;
};

// Close all connections
const closeAllConnections = async () => {
  for (const [dbName, connection] of connections) {
    await connection.close();
    connections.delete(dbName);
    console.log(`Closed connection to ${dbName}`);
  }
};

module.exports = {
  getConnection,
  closeAllConnections
};
