"use client";
import Link from "next/link";




export default function PricingPage() {
  // Simulated user state — replace these with your auth/user context or session values
  const isLoggedIn = true;
  const isPremium = false; // Set to true to test the Premium state

  // Access Rule Check: Only accessible to logged-in users on the Free plan
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Access Restricted</h1>
        <p className="text-gray-600 mt-2">Please log in to view subscription options.</p>
        <Link
          href="/login"
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Top Header / Access Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-blue-50 border border-blue-200 p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Upgrade Your Plan</h1>
          <p className="text-gray-600 mt-1">
            Unlock maximum potential and exclusive features with LifeCoach Premium.
          </p>
        </div>

        {/* Dynamic Badge / Action based on status */}
        {isPremium ? (
          < div>
            <section>
              <button type="submit" role="link" className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold rounded-full shadow-sm text-sm shrink-0">
                Premium ⭐
              </button>
            </section>
          </div>
        ) : (
          <form action="/api/checkout_sessions" method="POST">
            <section>
              <button type="submit" role="link" className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold rounded-full shadow-sm text-sm shrink-0 cursor-pointer">
                Get Premium ⭐
              </button>
            </section>
          </form>
        )}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 text-sm">
              <th className="py-4 px-6 font-bold w-1/2">Features</th>
              <th className="py-4 px-6 font-bold text-center w-1/4">Free</th>
              <th className="py-4 px-6 font-bold text-center w-1/4 bg-amber-50/60 text-amber-900">
                Premium ⭐
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {/* Row 1 */}
            <tr>
              <td className="py-4 px-6 font-medium">Lesson Creation Limit</td>
              <td className="py-4 px-6 text-center text-gray-600">Up to 3 Lessons</td>
              <td className="py-4 px-6 text-center font-semibold text-amber-900 bg-amber-50/30">
                Unlimited
              </td>
            </tr>

            {/* Row 2 */}
            <tr>
              <td className="py-4 px-6 font-medium">Premium Lesson Creation</td>
              <td className="py-4 px-6 text-center text-red-500 font-bold">✕</td>
              <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-amber-50/30">
                ✓
              </td>
            </tr>

            {/* Row 3 */}
            <tr>
              <td className="py-4 px-6 font-medium">Ad-Free Experience</td>
              <td className="py-4 px-6 text-center text-gray-500">Supported by Ads</td>
              <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-amber-50/30">
                100% Ad-Free
              </td>
            </tr>

            {/* Row 4 */}
            <tr>
              <td className="py-4 px-6 font-medium">Priority Listing in Public Lessons</td>
              <td className="py-4 px-6 text-center text-red-500 font-bold">✕</td>
              <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-amber-50/30">
                Top Visibility
              </td>
            </tr>

            {/* Row 5 */}
            <tr>
              <td className="py-4 px-6 font-medium">Access to Premium Content from Others</td>
              <td className="py-4 px-6 text-center text-gray-500">Free Content Only</td>
              <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-amber-50/30">
                Full Unrestricted Access
              </td>
            </tr>

            {/* Row 6 */}
            <tr>
              <td className="py-4 px-6 font-medium">Community Badge / Verified Status</td>
              <td className="py-4 px-6 text-center text-red-500 font-bold">✕</td>
              <td className="py-4 px-6 text-center font-bold text-amber-600 bg-amber-50/30">
                ⭐ Verified Badge
              </td>
            </tr>

            {/* Row 7 */}
            <tr>
              <td className="py-4 px-6 font-medium">Analytics & Insights</td>
              <td className="py-4 px-6 text-center text-gray-500">Basic Stats</td>
              <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-amber-50/30">
                Advanced Analytics
              </td>
            </tr>

            {/* Row 8 */}
            <tr>
              <td className="py-4 px-6 font-medium">Customer Support</td>
              <td className="py-4 px-6 text-center text-gray-500">Standard</td>
              <td className="py-4 px-6 text-center text-emerald-600 font-bold bg-amber-50/30">
                24/7 Priority Support
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Upgrade CTA Banner */}
      {!isPremium && (
        <div className="mt-8 text-center bg-linear-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">Ready to boost your journey?</h2>
          <p className="text-blue-100 mt-1 max-w-md mx-auto">
            Get unlimited access to all features and exclusive lessons today.
          </p>
          <form action="/api/checkout_sessions" method="POST">
            <button type="submit" className="mt-5 px-8 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base rounded-xl transition shadow-md cursor-pointer">
              Upgrade Now
            </button>
          </form>
        </div>
      )}
    </div>
  );
}