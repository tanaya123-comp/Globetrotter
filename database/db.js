

// db.js
const { Pool } = require('pg');

// Database connection details
const pool = new Pool({
    user: 'globetrotter_user',        // replace with your database username
    host: 'localhost',               // or your database host
    database: 'globetrotter',        // replace with your database name
    password: 'securepassword',    // replace with your database password
    port: 5432,                      // default PostgreSQL port
});

// Create a query function to interact with the database
const query = (text, params) => pool.query(text, params);

module.exports = {
    query,
};
