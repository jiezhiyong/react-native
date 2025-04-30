const stripe = require('stripe')(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  const { some } = await request.json();
  console.log('create-payment-intent+api', some);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1,
    currency: 'cny',
  });
  const clientSecret = paymentIntent.client_secret;
  return Response.json({ clientSecret });
}

export async function GET(request: Request) {
  console.log('create-payment-intent+api', process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return Response.json({ publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY });
}
