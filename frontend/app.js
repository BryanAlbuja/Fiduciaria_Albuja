document.addEventListener('DOMContentLoaded', () => {
    const invoiceForm = document.getElementById('invoice-form');
    const paymentForm = document.getElementById('payment-form');
    const invoiceListContainer = document.getElementById('invoice-list-container');
    const paymentListContainer = document.getElementById('payment-list-container');

    const token = localStorage.getItem('token');

    // Crear una nueva factura
    invoiceForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const clientName = document.getElementById('client_name').value;
        const amount  = parseFloat(document.getElementById('amount').value);
        const dueDate = document.getElementById('due_date').value;

        try {
            const response = await fetch('http://localhost:3000/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ client_name: clientName, amount: amount, due_date: dueDate })
            });

            if (response.ok) {
                alert('Factura creada exitosamente');
                invoiceForm.reset();
                fetchInvoices();
            } else {
                const data = await response.json();
                alert(data.error || 'Error al crear factura');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear factura');
        }
    });

    // Registrar un pago
    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const invoiceId = document.getElementById('invoice_id').value;
        const paymentAmount = document.getElementById('payment_amount').value;
        const paymentDate = document.getElementById('payment_date').value;

        try {
            const response = await fetch('http://localhost:3000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ invoice_id: invoiceId, amount: paymentAmount, payment_date: paymentDate })
            });

            if (response.ok) {
                alert('Pago registrado exitosamente');
                paymentForm.reset();
                fetchPayments();  // Actualizar la lista de pagos
                fetchInvoices();  // Actualizar la lista de facturas
            } else {
                const data = await response.json();
                alert(data.error || 'Error al registrar pago');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar pago');
        }
    });

    // Mostrar facturas
    const fetchInvoices = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/invoices', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error fetching invoices');
            const invoices = await response.json();
            displayInvoices(invoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const displayInvoices = (invoices) => {
        invoiceListContainer.innerHTML = '';
        if (invoices.length === 0) {
            invoiceListContainer.innerHTML = '<p>No se encontraron facturas.</p>';
            return;
        }
        invoices.forEach(invoice => {
            const invoiceCard = document.createElement('div');
            invoiceCard.classList.add('invoice-card');
            invoiceCard.innerHTML = `
                <h3>Factura #${invoice.id}</h3>
                <p>Cliente: ${invoice.client_name}</p>
                <p>Importe: $${invoice.amount}</p>
                <p>Fecha de Vencimiento: ${invoice.due_date}</p>
                <p>Estado: ${invoice.paid ? 'Pagada' : 'Pendiente'}</p>
            `;
            invoiceListContainer.appendChild(invoiceCard);
        });
    };

    // Mostrar pagos
    const fetchPayments = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error fetching payments');
            const payments = await response.json();
            displayPayments(payments);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const displayPayments = (payments) => {
        paymentListContainer.innerHTML = '';
        if (payments.length === 0) {
            paymentListContainer.innerHTML = '<p>No se encontraron pagos.</p>';
            return;
        }
        payments.forEach(payment => {
            const paymentCard = document.createElement('div');
            paymentCard.classList.add('payment-card');
            paymentCard.innerHTML = `
                <h3>Pago #${payment.id}</h3>
                <p>Factura ID: ${payment.invoice_id}</p>
                <p>Importe: $${payment.amount}</p>
                <p>Fecha: ${payment.payment_date}</p>
            `;
            paymentListContainer.appendChild(paymentCard);
        });
    };

    // Cargar facturas y pagos al iniciar
    fetchInvoices();
    fetchPayments();
});
