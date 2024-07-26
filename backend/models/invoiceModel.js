// backend/models/invoiceModel.js
const pool = require('../config/db'); // Ajusta la ruta si es necesario

const getAllInvoices = async () => {
  const result = await pool.query('SELECT * FROM invoices');
  return result.rows;
};

const createInvoice = async (invoice) => {
  const { client_name, amount, due_date } = invoice;
  const result = await pool.query(
    'INSERT INTO invoices (client_name, amount, due_date) VALUES ($1, $2, $3) RETURNING *',
    [client_name, amount, due_date]
  );
  return result.rows[0];
};

module.exports = {
  getAllInvoices,
  createInvoice,
};
