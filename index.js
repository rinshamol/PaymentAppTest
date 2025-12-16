const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

// DATABASE CONNECTION 
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});


// TEST API
app.get("/", (req, res) => {
  res.json({ message: "Payment API running" });
});


// GET customers
app.get("/customers", async (req, res) => {
  const result = await pool.query("SELECT * FROM customers");
  res.json(result.rows);
});

// POST payment
app.post("/payments", async (req, res) => {
  const { account_number, payment_amount } = req.body;

  const customer = await pool.query(
    "SELECT id FROM customers WHERE account_number=$1",
    [account_number]
  );

  if (customer.rows.length === 0)
    return res.status(404).json({ message: "Customer not found" });

  await pool.query(
    "INSERT INTO payments (customer_id, payment_amount) VALUES ($1,$2)",
    [customer.rows[0].id, payment_amount]
  );

  res.json({ message: "Payment successful" });
});

// GET payment history
app.get("/payments/:account", async (req, res) => {
  const result = await pool.query(
    `SELECT p.payment_amount, p.payment_date
     FROM payments p
     JOIN customers c ON p.customer_id=c.id
     WHERE c.account_number=$1`,
    [req.params.account]
  );
  console.log("test")
  res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const PROTOCOL = process.env.PROTOCOL || 'http';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

