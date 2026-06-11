require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database.');

    const adminHash = await bcrypt.hash('Admin@123', 10);
    const staffHash = await bcrypt.hash('Staff@123', 10);

    await connection.execute(
      `INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Admin User', 'admin@company.com', adminHash, 'admin']
    );

    await connection.execute(
      `INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      ['Staff User', 'staff@company.com', staffHash, 'staff']
    );

    console.log('Database seeded with admin and staff users.');
    await connection.end();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();
