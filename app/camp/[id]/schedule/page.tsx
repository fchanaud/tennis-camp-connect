'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Collapsible } from '@/components/ui/Collapsible';
import { Alert } from '@/components/ui/Alert';
import { RecommendationCard } from '@/components/schedule/RecommendationCard';
import { recommendations } from '@/lib/constants/recommendations';
import { Spinner } from '@/components/ui/Spinner';

function getDatesInRange(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  
  return dates;
}

export default function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: campId } = use(params);
  const [loading, setLoading] = useState(true);
  const [camp, setCamp] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);

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

        // Fetch schedules
        const schedulesResponse = await fetch(`/api/camps/${campId}/schedules`);
        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json();
          setSchedules(schedulesData);
        }
      } catch (error) {
        console.error('Error loading schedule page data:', error);
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
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!camp) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <Alert variant="danger">Camp not found</Alert>
        </div>
      </AppLayout>
    );
  }

  const dates = getDatesInRange(camp.start_date, camp.end_date);
  const scheduleMap = new Map(schedules?.map(s => [s.schedule_date, s.schedule_content]) || []);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Camp / </span>
          <span className="font-semibold">Schedule</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Your camp schedule</h1>

        {/* Daily Schedules */}
        <div className="space-y-3 mb-12">
          {dates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const scheduleContent = scheduleMap.get(dateStr);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

            return (
              <Collapsible key={dateStr} title={dayName}>
                {scheduleContent ? (
                  <div className="whitespace-pre-wrap">
                    {scheduleContent}
                  </div>
                ) : (
                  <Alert variant="info">
                    No schedule added yet for this day.
                  </Alert>
                )}
              </Collapsible>
            );
          })}
        </div>

        {/* Recommendations Section */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Recommendations</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Discover the best places to eat, relax, and explore during your stay in Marrakech.
          </p>
          
          <div className="row">
            {recommendations.map((rec, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                <RecommendationCard recommendation={rec} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
