import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../lib/stripe';

export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1U6CzzKxRaLSRg8XBSJXiZnf',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      // Remove or set a valid string without curly braces:
      integration_identifier: 'lifecoach_checkout', 
    });

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}