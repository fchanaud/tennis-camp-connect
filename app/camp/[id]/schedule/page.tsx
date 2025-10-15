import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/utils/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Collapsible } from '@/components/ui/Collapsible';
import { Alert } from '@/components/ui/Alert';
import { RecommendationCard } from '@/components/schedule/RecommendationCard';
import { recommendations } from '@/lib/constants/recommendations';
import { createClient } from '@/lib/supabase/server';

function getDatesInRange(startDate: string, endDate: string): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  
  return dates;
}

export default async function SchedulePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const campId = params.id;

  // Get camp details
  const { data: camp } = await supabase
    .from('camps')
    .select('*')
    .eq('id', campId)
    .single();

  if (!camp) redirect('/home');

  // Get all schedules for this camp
  const { data: schedules } = await supabase
    .from('camp_schedules')
    .select('*')
    .eq('camp_id', campId)
    .order('schedule_date', { ascending: true });

  const dates = getDatesInRange(camp.start_date, camp.end_date);
  const scheduleMap = new Map(schedules?.map(s => [s.schedule_date, s.schedule_content]) || []);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar user={user} camps={[camp]} />
      
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Camp / </span>
          <span className="font-semibold">Schedule</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Your Camp Schedule</h1>

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
          <h2 className="text-3xl font-bold mb-6">Recommendations</h2>
          <p className="text-gray-600 mb-6">
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
    </div>
  );
}

