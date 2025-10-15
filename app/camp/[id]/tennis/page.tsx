import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/utils/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { AssessmentForm } from '@/components/features/AssessmentForm';
import { createClient } from '@/lib/supabase/server';

export default async function TennisPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const campId = params.id;

  // Get camp details with coach info
  const { data: camp } = await supabase
    .from('camps')
    .select(`
      *,
      coach:users!camps_coach_id_fkey (
        id,
        first_name,
        last_name
      )
    `)
    .eq('id', campId)
    .single();

  if (!camp) redirect('/home');

  // Get assessment if exists
  const { data: assessment } = await supabase
    .from('pre_camp_assessments')
    .select('*')
    .eq('player_id', user.id)
    .eq('camp_id', campId)
    .single();

  // Get post-camp report if exists
  const { data: report } = await supabase
    .from('post_camp_reports')
    .select('*')
    .eq('player_id', user.id)
    .eq('camp_id', campId)
    .single();

  const isNoTennis = camp.package === 'no_tennis';

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar user={user} camps={[camp]} />
      
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Camp / </span>
          <span className="font-semibold">Tennis</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Your Tennis Program</h1>

        {isNoTennis ? (
          <Alert variant="info">
            This camp does not include tennis activities.
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Court Location */}
            <Card>
              <CardBody>
                <CardTitle>Court Location</CardTitle>
                <div className="mt-4">
                  <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6748934058!2d-7.9898!3d31.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM3JzQ2LjIiTiA3wrA1OSczNS4zIlc!5e0!3m2!1sen!2s!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 text-gray-600">JXQC+JMQ, Marrakech, Morocco</p>
                </div>
              </CardBody>
            </Card>

            {/* Camp Details */}
            <Card>
              <CardBody>
                <CardTitle>Camp Details</CardTitle>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dates:</span>
                    <span className="font-semibold">
                      {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <Badge variant="primary">
                      {camp.package.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Tennis Hours:</span>
                    <span className="font-semibold">{camp.total_tennis_hours || 'N/A'}</span>
                  </div>
                  {camp.coach && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coach:</span>
                      <span className="font-semibold">{camp.coach.first_name} {camp.coach.last_name}</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Pre-Camp Assessment */}
            <AssessmentForm
              campId={campId}
              playerId={user.id}
              existingAssessment={assessment}
            />

            {/* Post-Camp Report */}
            <Card>
              <CardBody>
                <CardTitle>Post-Camp Report</CardTitle>
                {report ? (
                  <div className="mt-4">
                    <Alert variant="success" className="mb-4">
                      Your coach has completed your post-camp report!
                    </Alert>
                    <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                      {report.report_content}
                    </div>
                  </div>
                ) : (
                  <CardText className="mt-4">
                    No report available yet. Your coach will provide feedback after the camp concludes.
                  </CardText>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

