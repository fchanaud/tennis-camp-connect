'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardBody } from '@/components/ui/Card';
import { Collapsible } from '@/components/ui/Collapsible';
import { RecommendationCard } from '@/components/schedule/RecommendationCard';
import { CampSchedule } from '@/types';
import { recommendations } from '@/lib/constants/recommendations';

export default function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: campId } = use(params);
  const [loading, setLoading] = useState(true);
  const [camp, setCamp] = useState<any>(null);
  const [schedules, setSchedules] = useState<CampSchedule[]>([]);

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
          setSchedules(schedulesData || []);
        }
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

        {/* Daily Schedules */}
        {schedules.length > 0 ? (
          <div className="space-y-4 mb-8">
            {schedules.map((schedule) => (
              <Collapsible
                key={schedule.id}
                title={new Date(schedule.schedule_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                defaultOpen={true}
              >
                <div className="pt-4">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {schedule.schedule_content}
                  </div>
                </div>
              </Collapsible>
            ))}
          </div>
        ) : (
          <Card className="mb-8">
            <CardBody>
              <Alert variant="info">
                No schedule has been set for this camp yet. Check back soon for daily activities!
              </Alert>
            </CardBody>
          </Card>
        )}

        {/* Recommendations Section */}
        <div className="mt-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Recommendations</h2>
          <p className="text-gray-600 mb-6">
            Discover the best places to eat, relax, and explore during your stay in Marrakech.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}