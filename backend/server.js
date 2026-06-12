import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use(limiter);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Supabase Admin Client (Bypasses RLS)
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// We need raw bodies for Stripe Webhook signature verification
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      console.log(`Upgrading user ${userId} to PRO...`);
      // Update the user's profile in Supabase to 'PRO'
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ 
          plan: 'PRO',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating Supabase profile:', error);
        return res.status(500).end();
      }
      console.log(`User ${userId} successfully upgraded!`);
    }
  }

  // Handle subscription cancellation / failure
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    console.log(`Downgrading subscription ${subscription.id} to FREE...`);
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ plan: 'FREE' })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error downgrading Supabase profile:', error);
      return res.status(500).end();
    }
    console.log(`Subscription ${subscription.id} successfully downgraded.`);
  }

  res.json({ received: true });
});

// Middleware for parsing JSON (for all other routes)
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

// Route to verify a checkout session (Easier than Webhooks for Local Testing)
app.post('/verify-session', async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'Missing session ID' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const userId = session.client_reference_id;
      
      // Update Supabase to PRO
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'PRO' })
        .eq('id', userId);

      if (error) throw error;
      
      return res.json({ success: true, message: 'User upgraded to PRO' });
    } else {
      return res.json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to create a Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { userId, email } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Hell Yeah Games - Pro Gamer Plan',
              description: 'Unlimited access to all premium games, ad-free.',
              images: ['https://gamedistribution.com/images/logo.png'], // Placeholder
            },
            unit_amount: 999, // $9.99 in cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email || undefined,
      client_reference_id: userId,
      success_url: `${process.env.CLIENT_URL}/games?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN ROUTES --- //

// Middleware to verify Supabase JWT (any authenticated user)
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to verify Supabase JWT and check if user is an admin
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch all users
app.get('/api/users', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, plan, role')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user plan
app.post('/api/users/:id/plan', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ plan })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROMO ROUTES --- //
const VALID_PROMO_CODES = {
  'BEELEE1976': 'Pro Gamer plan unlocked for free! Welcome, Boss 👑'
};

app.post('/api/redeem-promo', requireAuth, async (req, res) => {
  const { code } = req.body;
  if (VALID_PROMO_CODES[code]) {
    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'PRO' })
        .eq('id', req.user.id);
      
      if (error) throw error;
      res.json({ success: true, message: VALID_PROMO_CODES[code] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: 'Invalid promo code.' });
  }
});

// --- HEARTBEAT ROUTE --- //
app.post('/api/heartbeat', requireAuth, async (req, res) => {
  try {
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('trial_seconds_remaining')
      .eq('id', req.user.id)
      .single();

    if (fetchError || !profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let remaining = profile.trial_seconds_remaining;
    
    if (remaining > 0) {
      remaining = Math.max(0, remaining - 60);
      
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ trial_seconds_remaining: remaining })
        .eq('id', req.user.id);
        
      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
    }

    res.json({ success: true, trial_seconds_remaining: remaining });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
