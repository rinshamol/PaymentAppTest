const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// DATABASE CONNECTION 
const pool = new Pool({
  user: 'postgres',
  host: 'payment-db.c7ay86oy82u4.ap-south-1.rds.amazonaws.com',
  database: 'paymentdb',
  password: 'Rinsha123',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// TEST API
app.get("/", (req, res) => {
  res.send("Payment API running");
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
  res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const PROTOCOL = process.env.PROTOCOL || 'http';

app.listen(PORT, () => {
  console.log(`Server running at ${PROTOCOL}://${HOST}:${PORT}`);
});
