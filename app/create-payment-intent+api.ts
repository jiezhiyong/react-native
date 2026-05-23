import Stripe from 'stripe';

function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY ?? process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(apiKey);
}

export async function POST(request: Request) {
  try {
    const { some } = await request.json();
    console.log('create-payment-intent+api', some);

    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1,
      currency: 'cny',
    });
    const clientSecret = paymentIntent.client_secret;
    return Response.json({ clientSecret });
  } catch (error) {
    console.error('create-payment-intent+api POST error:', error);
    return Response.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  console.log('create-payment-intent+api', process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return Response.json({ publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY });
}
