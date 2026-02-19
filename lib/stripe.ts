/**
 * Stripe Payment Integration Setup
 * 
 * To enable Stripe payments:
 * 
 * 1. Install Stripe:
 *    npm install stripe @stripe/react-stripe-js @stripe/stripe-js
 * 
 * 2. Add your Stripe keys to .env.local:
 *    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 *    STRIPE_SECRET_KEY=sk_test_...
 * 
 * 3. Uncomment the code below and integrate with checkout page
 */

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
};

/**
 * Example Stripe Payment Intent Route Handler
 * Create file: app/api/create-payment-intent/route.ts
 * 
 * import { NextRequest, NextResponse } from 'next/server';
 * import Stripe from 'stripe';
 * 
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 * 
 * export async function POST(request: NextRequest) {
 *   try {
 *     const { amount, orderId, customerEmail } = await request.json();
 * 
 *     const paymentIntent = await stripe.paymentIntents.create({
 *       amount: Math.round(amount * 100), // Convert to cents
 *       currency: 'usd',
 *       metadata: {
 *         orderId: orderId,
 *       },
 *       receipt_email: customerEmail,
 *     });
 * 
 *     return NextResponse.json({
 *       clientSecret: paymentIntent.client_secret,
 *     });
 *   } catch (error) {
 *     return NextResponse.json(
 *       { error: 'Failed to create payment intent' },
 *       { status: 500 }
 *     );
 *   }
 * }
 */

/**
 * Example Stripe Webhook Handler
 * Create file: app/api/webhooks/stripe/route.ts
 * 
 * import { NextRequest, NextResponse } from 'next/server';
 * import Stripe from 'stripe';
 * 
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 * 
 * export async function POST(request: NextRequest) {
 *   const body = await request.text();
 *   const sig = request.headers.get('stripe-signature')!;
 * 
 *   try {
 *     const event = stripe.webhooks.constructEvent(
 *       body,
 *       sig,
 *       process.env.STRIPE_WEBHOOK_SECRET!
 *     );
 * 
 *     switch (event.type) {
 *       case 'payment_intent.succeeded':
 *         const paymentIntent = event.data.object as Stripe.PaymentIntent;
 *         console.log('Payment succeeded:', paymentIntent.id);
 *         // Update order status to paid
 *         break;
 * 
 *       case 'payment_intent.payment_failed':
 *         console.log('Payment failed');
 *         // Update order status to failed
 *         break;
 *     }
 * 
 *     return NextResponse.json({ received: true });
 *   } catch (error) {
 *     return NextResponse.json(
 *       { error: 'Webhook signature verification failed' },
 *       { status: 400 }
 *     );
 *   }
 * }
 */

/**
 * Example Stripe Provider Component
 * 
 * 'use client';
 * 
 * import { loadStripe } from '@stripe/stripe-js';
 * import { Elements } from '@stripe/react-stripe-js';
 * import { ReactNode } from 'react';
 * 
 * const stripePromise = loadStripe(
 *   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
 * );
 * 
 * export function StripeProvider({ children }: { children: ReactNode }) {
 *   return <Elements stripe={stripePromise}>{children}</Elements>;
 * }
 */

export const stripePaymentMethods = [
  'card',
  'ideal', // Netherlands
  'sepa_debit', // Europe
  'giropay', // Germany
  'eps', // Austria
  'bancontact', // Belgium
  'p24', // Poland
];

export const stripeLocales = [
  'auto',
  'en',
  'es',
  'fr',
  'de',
  'nl',
  'it',
  'pt',
  'zh',
  'ja',
];
