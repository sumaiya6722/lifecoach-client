import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '../../../lib/stripe';
import { MongoClient } from 'mongodb';

// Shared database client instance
const client = new MongoClient(process.env.MONGO_URL);

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  if (session.status === 'open') {
    return redirect('/');
  }

  if (session.status === 'complete') {
    const customerEmail = session.customer_details?.email;

    if (customerEmail) {
      await client.connect();
      const db = client.db('lifecoach');

      // 1. Fetch current user to preserve their role (user vs admin)
      const currentUser = await db.collection('user').findOne({ email: customerEmail });

      if (currentUser) {
        const newPlan = currentUser.role === 'admin' ? 'admin_premium' : 'user_premium';

        // 2. Update user plan
        await db.collection('user').updateOne(
          { email: customerEmail },
          {
            $set: {
              plan: newPlan,
              updatedAt: new Date(),
            },
          }
        );
      }
    }

    return (
      <section
        id="success"
        className="p-8 text-center max-w-lg mx-auto my-12 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm"
      >
        <h1 className="text-2xl font-bold text-emerald-800 mb-2">
          Upgrade Successful! ⭐
        </h1>
        <p className="text-gray-700">
          We appreciate your business! Your account has been upgraded to{' '}
          <strong>Premium</strong>.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          A confirmation email will be sent to <strong>{customerEmail}</strong>.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    );
  }
}