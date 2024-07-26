// backend/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Obtener todas las facturas


// Crear una nueva factura
router.post('/', invoiceController.createInvoice);
// Obtener todas las facturas
router.get('/', invoiceController.getAllInvoices);

module.exports = router;
