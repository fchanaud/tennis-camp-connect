'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function WaitlistPage({ params }: { params: Promise<{ campId: string }> }) {
  const [campId, setCampId] = useState<string>('');

  useEffect(() => {
    async function getCampId() {
      const resolvedParams = await params;
      setCampId(resolvedParams.campId);
    }
    getCampId();
  }, [params]);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
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
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <Card>
          <CardBody className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#FFD633] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-900"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Camp is Full</h1>
              <p className="text-gray-600 mt-4">
                This camp has reached its maximum capacity.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4 text-left">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Upcoming Camps</h2>
                <p className="text-gray-700 mb-4">
                  We have camps scheduled for <strong>May</strong> and <strong>June</strong>.
                </p>
                <p className="text-gray-700">
                  For more information about upcoming camps and availability, please contact{' '}
                  <a
                    href="mailto:hello@aceawaytravel.com"
                    className="text-[#2563EB] hover:underline font-medium"
                  >
                    Ace Away Travel
                  </a>
                  .
                </p>
              </div>

            </div>
          </CardBody>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 md:mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Tennis Camp Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
