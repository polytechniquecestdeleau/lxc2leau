const express = require('express');
const { createMollieClient } = require('@mollie/api-client');

const router = express.Router();
const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

router.post('/mollie', async (req, res) => {
  res.sendStatus(200); // répondre vite à Mollie

  try {
    const paymentId = req.body?.id;
    if (!paymentId) return;

    const payment    = await mollie.payments.get(paymentId);
    const customerId = payment.metadata?.customerId;

    console.log(`[Webhook] ${paymentId} → ${payment.status}`);

    if (payment.status === 'paid' && payment.sequenceType === 'first') {
      // Créer l'abonnement récurrent mensuel
      await mollie.customerSubscriptions.create({
        customerId,
        amount:      { currency: 'EUR', value: '49.00' },
        interval:    '1 month',
        description: 'LXC2LO — Abonnement mensuel',
        webhookUrl:  `${process.env.BASE_URL}/webhooks/mollie`,
      });
      console.log(`[Webhook] Abonnement créé pour ${customerId}`);
      // TODO: envoyer le lien d'invitation Discord par email
    }
  } catch (err) {
    console.error('[Webhook error]', err);
  }
});

module.exports = router;
