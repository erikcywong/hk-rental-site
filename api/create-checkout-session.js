// Vercel Serverless Function - Create Stripe Checkout Session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType, locale, paymentMethod } = req.body;

    // Map frontend payment method to Stripe payment_method_types
    const methodMapping = {
      stripe: ['card'],                          // 信用卡/Debit Card
      alipay: ['card', 'alipay'],                // Alipay HK
      wechat: ['card', 'wechat_pay'],            // WeChat Pay
    };
    const paymentMethodTypes = methodMapping[paymentMethod] || ['card', 'alipay', 'wechat_pay'];

    // Plan pricing mapping
    const plans = {
      free: { name: '免費體驗', nameEn: 'Free Trial', price: 0, priceId: null },
      basic: { name: '基礎版', nameEn: 'Basic Plan', price: 48, priceId: process.env.STRIPE_PRICE_BASIC || null },
      pro: { name: '高級版', nameEn: 'Pro Plan', price: 128, priceId: process.env.STRIPE_PRICE_PRO || null },
      enterprise: { name: '企業版', nameEn: 'Enterprise Plan', price: 388, priceId: process.env.STRIPE_PRICE_ENTERPRISE || null }
    };

    const plan = plans[planType];
    if (!plan || plan.price === 0) {
      return res.status(400).json({ error: 'Invalid plan or free plan' });
    }

    // If Stripe Price ID is configured, use it (recommended for production)
    if (plan.priceId) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: paymentMethodTypes,
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin || 'https://www.hkrent.space'}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin || 'https://www.hkrent.space'}#pricing`,
        locale: locale === 'zh' ? 'zh-HK' : 'en',
        metadata: {
          planType: planType,
        },
      });

      return res.status(200).json({ url: session.url });
    }

    // Fallback: Create one-time payment (for testing without Price ID)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: 'hkd',
            product_data: {
              name: locale === 'zh' ? plan.name : plan.nameEn,
              description: `香港租房網 - ${locale === 'zh' ? plan.name : plan.nameEn}`,
            },
            unit_amount: plan.price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin || 'https://www.hkrent.space'}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://www.hkrent.space'}#pricing`,
      locale: locale === 'zh' ? 'zh-HK' : 'en',
      metadata: {
        planType: planType,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
