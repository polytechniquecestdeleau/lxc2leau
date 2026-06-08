const express = require('express');
const { createMollieClient } = require('@mollie/api-client');

const router = express.Router();
const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

// POST /api/mollie/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: 'email et name requis' });

    const customer = await mollie.customers.create({ name, email });

    const payment = await mollie.payments.create({
      amount:       { currency: 'EUR', value: '49.00' },
      customerId:   customer.id,
      sequenceType: 'first',
      description:  'LXC2LO — Abonnement mensuel',
      redirectUrl:  `${process.env.BASE_URL}/merci?customer=${customer.id}`,
      webhookUrl:   `${process.env.BASE_URL}/webhooks/mollie`,
      metadata:     { customerId: customer.id },
    });

    res.json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (err) {
    console.error('[Mollie subscribe]', err);
    res.status(500).json({ error: 'Erreur paiement' });
  }
});

module.exports = router;
