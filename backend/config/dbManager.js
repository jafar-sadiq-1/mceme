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

// Close all connections
const closeAllConnections = async () => {
  for (const [dbName, connection] of connections) {
    await connection.close();
    connections.delete(dbName);
    console.log(`Closed connection to ${dbName}`);
  }
};

// Get connection for specific financial year
const getConnection = async (financialYear) => {
  if (!financialYear) throw new Error('Financial year is required');
  
  validateFinancialYear(financialYear);
  const dbName = `mceme_${financialYear}`;
  
  if (connections.has(dbName)) {
    return connections.get(dbName);
  }

  try {
    // Close all existing connections before establishing a new one
    await closeAllConnections();

    const connection = await mongoose.createConnection(
      `${baseUrl}/${dbName}?retryWrites=true&w=majority`
    );

    connections.set(dbName, connection);
    console.log(`Connected to database: ${dbName}`);
    return connection;
  } catch (error) {
    console.error(`Failed to connect to database ${dbName}:`, error);
    throw error;
  }
};

module.exports = {
  getConnection,
  closeAllConnections
};
