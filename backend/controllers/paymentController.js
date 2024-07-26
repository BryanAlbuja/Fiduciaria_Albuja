const pool = require('../config/db');

exports.createPayment = async (req, res) => {
    const { invoice_id, amount, payment_date } = req.body;

    // Convertir amount a número
    const numericAmount = parseFloat(amount);

    if ( numericAmount <= 0) {
        return res.status(400).json({ error: 'El importe del pago debe ser un número positivo' });
    }

    try {
        // Verificar si la factura existe
        const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoice_id]);
        if (invoiceResult.rows.length === 0) {
            return res.status(400).json({ error: 'Factura no encontrada' });
        }

        // Registrar el pago
        const result = await pool.query(
            'INSERT INTO payments (invoice_id, amount, payment_date) VALUES ($1, $2, $3) RETURNING *',
            [invoice_id, numericAmount, payment_date]
        );

        // Actualizar el estado de la factura si el pago completa la factura
        const payment = result.rows[0];
        const totalPaymentsResult = await pool.query('SELECT COALESCE(SUM(amount), 0) AS total_payments FROM payments WHERE invoice_id = $1', [invoice_id]);
        const totalPayments = totalPaymentsResult.rows[0].total_payments;

        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Error creating payment' });
    }
};
