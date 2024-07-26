// backend/models/paymentModel.js
const pool = require('../config/db'); // Ajusta la ruta si es necesario

const getAllPayments = async () => {
  const result = await pool.query('SELECT * FROM payments');
  return result.rows;
};

const createPayment = async (payment) => {
  const { invoice_id, amount, payment_date } = payment;
  const result = await pool.query(
    'INSERT INTO payments (invoice_id, amount, payment_date) VALUES ($1, $2, $3) RETURNING *',
    [invoice_id, amount, payment_date]
  );
  return result.rows[0];
};

module.exports = {
  getAllPayments,
  createPayment,
};
