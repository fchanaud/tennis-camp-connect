'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardBody } from '@/components/ui/Card';
import { Collapsible } from '@/components/ui/Collapsible';
import { RecommendationCard } from '@/components/schedule/RecommendationCard';
import { CampSchedule, Recommendation } from '@/types';
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
        <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
          Scroll to the bottom to view all recommendations with numbers and locations to help when looking at the schedule.
        </p>

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
        <RecommendationsSection />
      </div>
    </AppLayout>
  );
}

// Recommendations Section with Filtering
function RecommendationsSection() {
  const [selectedFilter, setSelectedFilter] = useState<Recommendation['type'] | 'all'>('all');

  const filterOptions: Array<{ value: 'food' | 'relax' | 'local' | 'all'; label: string; count: number }> = [
    { value: 'all' as const, label: 'All', count: recommendations.length },
    { value: 'food' as const, label: 'Food & Drinks', count: recommendations.filter(r => r.type === 'food').length },
    { value: 'relax' as const, label: 'Relax', count: recommendations.filter(r => r.type === 'relax').length },
    { value: 'local' as const, label: 'Local vibes', count: recommendations.filter(r => r.type === 'local').length },
  ].filter(option => option.count > 0 || option.value === 'all');

  // Reset filter to 'all' if somehow 'culture' is selected (shouldn't happen, but safeguard)
  useEffect(() => {
    if (selectedFilter === 'culture') {
      setSelectedFilter('all');
    }
  }, [selectedFilter]);

  const filteredRecommendations = selectedFilter === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === selectedFilter);

  return (
    <div className="mt-8 sm:mt-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
          Recommendations
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Discover the best places to eat, relax, and explore during your stay in Marrakech.
        </p>
      </div>

      {/* Filter Buttons - Mobile Optimized */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value)}
              className={`
                px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium text-sm sm:text-base
                transition-all duration-200 shadow-sm hover:shadow-md
                min-h-[44px] sm:min-h-[48px] flex items-center justify-center
                ${selectedFilter === option.value
                  ? option.value === 'all'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : option.value === 'food'
                    ? 'bg-[#FF4C4C] text-white shadow-md'
                    : option.value === 'relax'
                    ? 'bg-[#66B032] text-white shadow-md'
                    : 'bg-[#9B59B6] text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                }
              `}
              aria-label={`Filter by ${option.label}`}
            >
              <span className="whitespace-nowrap">{option.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                selectedFilter === option.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {filteredRecommendations.length > 0 && (
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
          Showing {filteredRecommendations.length} {filteredRecommendations.length === 1 ? 'recommendation' : 'recommendations'}
        </p>
      )}

      {/* Recommendations Grid */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {filteredRecommendations.map((rec, index) => (
            <RecommendationCard key={`${rec.type}-${index}`} recommendation={rec} />
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-8 sm:py-12 text-center">
            <p className="text-gray-500 text-base sm:text-lg">
              No recommendations found for this category.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}