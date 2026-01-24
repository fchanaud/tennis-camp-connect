'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type Camp = { id: string; start_date: string; end_date: string; package: string };
type Payment = { id: string; payment_method: string; payment_type: string; amount_pounds: number; status: string };
type RegistrationRow = {
  id: string;
  camp_id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  camp: Camp | Camp[] | null;
  payments: Payment[] | null;
};

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [error, setError] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.push('/home');
        return;
      }

      const response = await fetch('/api/admin/registrations');

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      } else {
        setError('Failed to load registrations');
      }
    } catch (err) {
      console.error('Error loading registrations:', err);
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (registrationId: string) => {
    setConfirmingId(registrationId);
    setError('');

    try {
      const res = await fetch(`/api/admin/registrations/${registrationId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
      } else {
        setError(data.error || 'Failed to confirm registration');
      }
    } catch (err) {
      setError('Failed to confirm registration');
    } finally {
      setConfirmingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getCamp = (r: RegistrationRow): Camp | null => {
    const c = r.camp;
    if (!c) return null;
    return Array.isArray(c) ? (c[0] as Camp) ?? null : (c as Camp);
  };

  const getPayment = (r: RegistrationRow): Payment | null => {
    const p = r.payments;
    if (!p || !Array.isArray(p) || p.length === 0) return null;
    return p[0] as Payment;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8 max-w-5xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">
            Revolut registrations
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Registrations paid via Revolut. Confirm each one once the payment has been received; Ace Away Travel can then get back to the participant.
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {registrations.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-gray-600 text-center py-6">
                No registrations awaiting confirmation. When someone pays with Revolut and clicks “I've paid — confirm”, they will appear here.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {registrations.map((r) => {
              const camp = getCamp(r);
              const payment = getPayment(r);
              return (
                <Card key={r.id}>
                  <CardBody>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="font-semibold">{r.name}</div>
                        <div className="text-sm text-gray-600">{r.email}</div>
                        {camp && (
                          <div className="text-sm text-gray-500 mt-1">
                            Camp: {formatDate(camp.start_date)} – {formatDate(camp.end_date)}
                          </div>
                        )}
                        {payment && (
                          <div className="mt-2">
                            <Badge variant="info" className="text-xs">
                              Revolut · £{payment.amount_pounds} ({payment.payment_type})
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="warning">Awaiting confirmation</Badge>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConfirm(r.id)}
                          disabled={confirmingId === r.id}
                        >
                          {confirmingId === r.id ? 'Confirming...' : 'Confirm registration'}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
