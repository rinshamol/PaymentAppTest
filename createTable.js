const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: 'postgres',
  host: 'payment-db.c7ay86oy82u4.ap-south-1.rds.amazonaws.com',
  database: 'paymentdb',
  password: 'Rinsha123',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        account_number VARCHAR(20) UNIQUE,
        issue_date DATE,
        interest_rate FLOAT,
        tenure INT,
        emi_due DECIMAL(10,2)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
        payment_amount DECIMAL(10,2),
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};
const insertCustomers = async () => {
  try {
    const customers = [
      { account_number: "ACC1001", issue_date: "2025-01-01", interest_rate: 12.5, tenure: 12, emi_due: 1000.50 },
      { account_number: "ACC1002", issue_date: "2025-02-01", interest_rate: 10.0, tenure: 24, emi_due: 1500.00 },
      { account_number: "ACC1003", issue_date: "2025-03-01", interest_rate: 11.0, tenure: 18, emi_due: 1200.75 }
    ];

    for (let c of customers) {
      await pool.query(
        `INSERT INTO customers (account_number, issue_date, interest_rate, tenure, emi_due)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (account_number) DO NOTHING`,
        [c.account_number, c.issue_date, c.interest_rate, c.tenure, c.emi_due]
      );
    }

    console.log("Sample customers inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error inserting customers:", err);
  }
};

insertCustomers();
