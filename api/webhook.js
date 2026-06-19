// Vercel Serverless Function - Stripe Webhook Handler
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function webhookHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    console.error('Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env var');
    return res.status(400).json({ error: 'Missing webhook configuration' });
  }

  // Read raw body from request stream (required for Stripe signature verification)
  let rawBody = '';
  for await (const chunk of req) {
    rawBody += chunk;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment successful:', session.id);
      console.log('Plan type:', session.metadata?.planType);
      console.log('Customer email:', session.customer_email);
      console.log('Amount:', session.amount_total, session.currency);
      break;

    case 'invoice.paid':
      console.log('✅ Invoice paid:', event.data.object.id);
      break;

    case 'invoice.payment_failed':
      console.log('❌ Payment failed:', event.data.object.id);
      break;

    case 'customer.subscription.created':
      console.log('Subscription created:', event.data.object.id);
      break;

    case 'customer.subscription.updated':
      console.log('Subscription updated:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

// Disable Vercel body parsing — Stripe needs the raw body to verify signature
webhookHandler.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = webhookHandler;
