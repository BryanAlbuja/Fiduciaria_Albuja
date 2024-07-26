const pool = require('../config/db'); // Asegúrate de que la ruta sea correcta

// Crear una nueva factura
exports.createInvoice = async (req, res) => {
    const { client_name, amount, due_date } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO invoices (client_name, amount, due_date) VALUES ($1, $2, $3) RETURNING *',
            [client_name, amount, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Error creating invoice' });
    }
};

// Obtener todas las facturas
exports.getAllInvoices = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM invoices');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Error fetching invoices' });
    }
};

// Crear un nuevo pago
exports.createPayment = async (req, res) => {
    const { invoice_id, amount, payment_date } = req.body;

    try {
        // Verificar si la factura existe
        const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoice_id]);
        if (invoiceResult.rows.length === 0) {
            return res.status(400).json({ error: 'Factura no encontrada' });
        }

        // Registrar el pago
        const result = await pool.query(
            'INSERT INTO payments (invoice_id, amount, payment_date) VALUES ($1, $2, $3) RETURNING *',
            [invoice_id, amount, payment_date]
        );

        // Actualizar el estado de la factura si el pago completa la factura
        const payment = result.rows[0];
        const totalPaymentsResult = await pool.query('SELECT COALESCE(SUM(amount), 0) AS total_payments FROM payments WHERE invoice_id = $1', [invoice_id]);
        const totalPayments = totalPaymentsResult.rows[0].total_payments;

        const invoice = invoiceResult.rows[0];
        if (totalPayments >= invoice.amount) {
            await pool.query('UPDATE invoices SET paid = TRUE WHERE id = $1', [invoice_id]);
        }

        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Error creating payment' });
    }
};

// Obtener todos los pagos
exports.getAllPayments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payments');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Error fetching payments' });
    }
};
