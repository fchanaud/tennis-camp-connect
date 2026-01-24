'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import type { Registration, RegistrationOption } from '@/types';
// Stripe will be loaded via Checkout Session redirect
// Note: Install Stripe SDK: npm install stripe @stripe/stripe-js

const BASE_CAMP_PRICE = 600; // shared bedroom
const DEPOSIT_AMOUNT = 250;
const PRIVATE_BEDROOM_UPGRADE = 90; // 600 + 90 = £690 for private double

const OPTION_PRICES: Record<string, number> = {
  hammam_massage: 45,
  massage: 40,
  hammam: 25,
  medina_tour: 30,
  friday_dinner: 30,
};

const OPTION_LABELS: Record<string, string> = {
  hammam_massage: 'Hammam / Massage (1 hour)',
  massage: 'Massage (1 hour)',
  hammam: 'Hammam (1 hour)',
  medina_tour: 'Medina private tour excursion (2 hours)',
  friday_dinner: 'Moroccan traditional dinner on Friday',
};

export default function PaymentPage({ params }: { params: Promise<{ campId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params_hook = useParams();
  const campId = params_hook?.campId as string;
  const registrationId = searchParams.get('registration_id');

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'revolut' | ''>('');
  const [paymentType, setPaymentType] = useState<'deposit' | 'full'>('deposit');
  const [revolutPaymentId, setRevolutPaymentId] = useState<string | null>(null);

  useEffect(() => {
    async function loadRegistration() {
      if (!registrationId) {
        setError('Registration ID is required');
        setLoading(false);
        return;
      }

      try {
        const resolvedParams = await params;
        const { campId } = resolvedParams;

        // Load registration with options
        const res = await fetch(`/api/register/${campId}/${registrationId}`);
        if (!res.ok) {
          throw new Error('Failed to load registration');
        }
        const registrationData = await res.json();
        setRegistration(registrationData);
      } catch (err) {
        setError('Failed to load registration');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRegistration();
  }, [registrationId, params]);

  // Calculate prices
  const bedroomUpgrade = registration?.bedroom_type === 'private_double' ? PRIVATE_BEDROOM_UPGRADE : 0;
  const optionsTotal = (registration?.options || registration?.registration_options || []).reduce(
    (sum, opt) => sum + (OPTION_PRICES[opt.option_type] || 0),
    0
  );
  const basePrice = BASE_CAMP_PRICE + bedroomUpgrade + optionsTotal;
  const depositAmount = DEPOSIT_AMOUNT;
  const fullAmount = basePrice;
  const balanceAmount = fullAmount - depositAmount;

  const handlePayment = async () => {
    if (!paymentMethod || !registrationId) {
      setError('Please select a payment method');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const resolvedParams = await params;
      const { campId } = resolvedParams;

      const response = await fetch(`/api/register/${campId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_id: registrationId,
          payment_method: paymentMethod,
          payment_type: paymentType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment processing failed');
      }

      if (paymentMethod === 'stripe') {
        // Redirect to Stripe Checkout Session
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Stripe checkout URL not received');
        }
      } else if (paymentMethod === 'revolut') {
        setRevolutPaymentId(data.payment_id);
        setProcessing(false);
        window.open('https://revolut.me/frankydch', '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProcessing(false);
    }
  };

  const handleRevolutConfirmation = async () => {
    if (!registrationId || !revolutPaymentId) {
      setError('Please create a payment first by selecting Revolut payment method');
      return;
    }

    setProcessing(true);
    try {
      const resolvedParams = await params;
      const { campId } = resolvedParams;

      const response = await fetch(`/api/register/${campId}/verify-revolut`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: revolutPaymentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      router.push(`/register/${campId}/confirmation?payment_method=revolut&status=pending&registration_id=${registrationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
          <CardBody>
            <CardTitle className="text-2xl mb-4">Payment</CardTitle>

            {registrationId && campId && (
              <p className="mb-4">
                <Link
                  href={`/register/${campId}?registration_id=${registrationId}`}
                  className="text-[#2563EB] hover:underline text-sm"
                >
                  ← Back to registration
                </Link>
              </p>
            )}

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Price Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{bedroomUpgrade > 0 ? 'Base camp:' : 'Base camp (shared bedroom):'}</span>
                  <span>£{BASE_CAMP_PRICE}</span>
                </div>
                {bedroomUpgrade > 0 && (
                  <div className="flex justify-between">
                    <span>Private double bedroom upgrade:</span>
                    <span>£{bedroomUpgrade}</span>
                  </div>
                )}
                {optionsTotal > 0 && (
                  <>
                    <div className="flex justify-between font-semibold">
                      <span>Optional activities:</span>
                      <span>£{optionsTotal}</span>
                    </div>
                    <div className="pl-4 text-xs text-gray-600">
                      {(registration?.options || registration?.registration_options || []).map((opt: { id: string; option_type: string }) => (
                        <div key={opt.id} className="flex justify-between">
                          <span>{OPTION_LABELS[opt.option_type] || opt.option_type}:</span>
                          <span>£{OPTION_PRICES[opt.option_type] || 0}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total (camp + options):</span>
                  <span>£{basePrice}</span>
                </div>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="mb-6">
              <label className="form-label text-sm font-medium text-[#1E1E1E] mb-2 block">
                Payment Type *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    value="deposit"
                    checked={paymentType === 'deposit'}
                    onChange={(e) => setPaymentType(e.target.value as 'deposit')}
                  />
                  <span>Pay deposit only (£{depositAmount})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentType"
                    value="full"
                    checked={paymentType === 'full'}
                    onChange={(e) => setPaymentType(e.target.value as 'full')}
                  />
                  <span>Pay full amount (£{fullAmount})</span>
                </label>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="form-label text-sm font-medium text-[#1E1E1E] mb-2 block">
                Payment Method *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="revolut"
                    checked={paymentMethod === 'revolut'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'revolut')}
                  />
                  <span>Revolut</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                  />
                  <span>Credit/Debit Card (Stripe)</span>
                </label>
              </div>
            </div>

            {/* Revolut Payment */}
            {paymentMethod === 'revolut' && (
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 p-5 md:p-6 border border-slate-200/80">
                {!revolutPaymentId ? (
                  <>
                    <p className="text-slate-700 text-sm md:text-base mb-4">
                      Add <strong className="text-slate-900">Marrakech Trip</strong> as the payment reference in Revolut.
                    </p>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handlePayment}
                      disabled={processing}
                      className="!py-3"
                    >
                      {processing ? 'Opening...' : `Pay £${paymentType === 'deposit' ? depositAmount : fullAmount} with Revolut`}
                    </Button>
                    <p className="text-slate-700 text-sm md:text-base mt-3 text-center font-medium">
                      Revolut will open in a new tab. Pay there, then come back and confirm below.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-700 text-sm md:text-base mb-1">
                      Pay <strong>£{paymentType === 'deposit' ? depositAmount : fullAmount}</strong> in Revolut with <strong className="text-slate-900">Marrakech Trip</strong> as the reference.
                    </p>
                    <p className="text-slate-500 text-xs mb-4">
                      <a href="https://revolut.me/frankydch" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline">Open Revolut link</a> again if needed. When you’re done, click below.
                    </p>
                    <p className="text-slate-600 text-sm mb-4 text-center">
                    Your registration will be confirmed once payment is received. Ace Away Travel will contact you with next steps shortly after.
                    </p>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleRevolutConfirmation}
                      disabled={processing}
                      className="!py-3"
                    >
                      {processing ? 'Processing...' : "I've paid — confirm"}
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Stripe Payment Button */}
            {paymentMethod === 'stripe' && (
              <Button
                variant="primary"
                fullWidth
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay ${paymentType === 'deposit' ? `£${depositAmount}` : `£${fullAmount}`}`}
              </Button>
            )}

            {!paymentMethod && (
              <p className="text-sm text-gray-600 text-center mt-4">
                Please select a payment method to continue
              </p>
            )}
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
