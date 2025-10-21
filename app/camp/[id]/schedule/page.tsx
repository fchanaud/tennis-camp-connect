'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';

export default function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: campId } = use(params);
  const [loading, setLoading] = useState(true);
  const [camp, setCamp] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
          return;
        }

        // Fetch camp details
        const campResponse = await fetch(`/api/camps/${campId}`);
        if (!campResponse.ok) {
          router.push('/home');
          return;
        }
        const campData = await campResponse.json();
        setCamp(campData);
      } catch (error) {
        console.error('Error loading camp data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [campId, router]);

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

  if (!camp) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <Alert variant="danger">
            Camp not found. Please check your camp details.
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Your Schedule</h1>

        <div className="text-center py-12">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Coming Up Soon</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We're working hard to bring you an amazing schedule experience. 
            Your personalized daily schedule will be available soon!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> Check back closer to your camp start date for detailed daily activities and timings.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}