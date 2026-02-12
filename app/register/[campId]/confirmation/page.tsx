'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ConfirmationPage({ params }: { params: Promise<{ campId: string }> }) {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get('payment_method');
  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');
  const [campId, setCampId] = useState<string>('');

  useEffect(() => {
    async function getCampId() {
      const resolvedParams = await params;
      setCampId(resolvedParams.campId);
    }
    getCampId();
  }, [params]);

  // When we have a Stripe session_id, verify the session and sync our DB.
  // This is a fallback if the webhook hasn’t run (e.g. local dev without Stripe CLI).
  // The webhook remains the main, reliable way to update the DB.
  useEffect(() => {
    if (!sessionId) return;

    fetch('/api/stripe/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    }).catch(() => {
      // Ignore: webhook may have already updated the DB
    });
  }, [sessionId]);

  // For Stripe, if session_id exists, payment was successful
  const isStripe = paymentMethod === 'stripe' && sessionId;
  const isRevolutPending = paymentMethod === 'revolut' && status === 'pending';
  const isRevolutConfirmed = paymentMethod === 'revolut' && status !== 'pending';

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shrink-0">
        <div className="container mx-auto px-3 py-2.5 sm:px-4 sm:py-3 md:py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <Link href="/login" className="text-base md:text-lg font-bold text-[#FF4C4C] cursor-pointer">
            Tennis Camp Connect
          </Link>
          <img
            src="/logo.png"
            alt="Tennis Camp Connect"
            className="h-6 w-auto sm:h-7 md:h-8 flex-shrink-0 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <Card>
          <CardBody className="text-center py-8 md:py-12 px-3 md:px-4">
            {isStripe && (
              <>
                <div className="mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#66B032] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xs md:text-lg lg:text-xl font-bold text-gray-900 mb-2">Your Registration is Confirmed</h1>
                  <Badge variant="secondary" className="mt-2">Payment Successful</Badge>
                </div>
              </>
            )}

            {isRevolutPending && (
              <>
                <div className="mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FFD633] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xs md:text-lg lg:text-xl font-bold text-gray-900 mb-2">Your Registration is Pending Confirmation</h1>
                  <Badge variant="warning" className="mt-2">Awaiting Manual Verification</Badge>
                </div>
              </>
            )}

            {isRevolutConfirmed && (
              <>
                <div className="mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#66B032] rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xs md:text-lg lg:text-xl font-bold text-gray-900 mb-2">Your Registration is Confirmed</h1>
                  <Badge variant="secondary" className="mt-2">Payment Verified</Badge>
                </div>
              </>
            )}

            <div className="max-w-2xl mx-auto space-y-4 text-left">
              <p className="text-gray-700 text-base md:text-lg">
                {isStripe ? (
                  <>
                    Thanks a lot! I'll reach out with the next steps, which include the recommended flight details.
                  </>
                ) : (
                  <>
                    Thanks a lot! Once payment is received, we will confirm your registration and share the next steps. This will include the recommended flight details. 
                  </>
                )}
              </p>
            </div>
          </CardBody>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 md:mt-16 shrink-0">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Tennis Camp Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
