'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { capitalizeName } from '@/lib/utils/auth';

export default function TennisPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: campId } = use(params);
  const [loading, setLoading] = useState(true);
  const [camp, setCamp] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(userStr);

        // Fetch camp details
        const campResponse = await fetch(`/api/camps/${campId}`);
        if (!campResponse.ok) {
          router.push('/home');
          return;
        }
        const campData = await campResponse.json();
        setCamp(campData);

        // Fetch assessment
        const assessmentResponse = await fetch(`/api/player/assessment?userId=${user.id}`);
        if (assessmentResponse.ok) {
          const assessmentData = await assessmentResponse.json();
          if (assessmentData.hasAssessment && assessmentData.assessment.camp_id === campId) {
            setAssessment(assessmentData.assessment);
          }
        }

        // Fetch report
        const reportResponse = await fetch(`/api/player/report?userId=${user.id}&campId=${campId}`);
        if (reportResponse.ok) {
          const reportData = await reportResponse.json();
          setReport(reportData.report);
        }
      } catch (error) {
        console.error('Error loading tennis page data:', error);
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

  const isNoTennis = camp.package === 'no_tennis';
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Camp / </span>
          <span className="font-semibold">Tennis</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Your tennis program</h1>

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
                  <div 
                    className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden relative"
                    style={{ touchAction: 'pan-y pinch-zoom' }}
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.8266861843846!2d-8.0564861!3d31.6491204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafeeeb6677a635%3A0x2936795494e33117!2sTennis%20Academy%20Marrakech!5e0!3m2!1sen!2s!4v1234567890&gestureHandling=greedy"
                      width="100%"
                      height="100%"
                      style={{ border: 0, pointerEvents: 'auto' }}
                      allowFullScreen
                      loading="lazy"
                      title="Tennis Academy Marrakech Location"
                    />
                  </div>
                  <p className="mt-3 text-sm sm:text-base text-gray-600">
                    <a 
                      href="https://www.google.com/maps/place/Tennis+Academy+Marrakech/@31.6491204,-8.0539112,17z/data=!3m1!4b1!4m6!3m5!1s0xdafeeeb6677a635:0x2936795494e33117!8m2!3d31.6491204!4d-8.0539112!16s%2Fg%2F11ckr5vc9_?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      📍 Tennis Academy Marrakech
                    </a>
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Camp Details */}
            <Card>
              <CardBody>
                <CardTitle>Camp Details</CardTitle>
                <div className="space-y-2 mt-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-sm sm:text-base text-gray-600">Dates:</span>
                    <span className="font-semibold text-sm sm:text-base break-words">
                      {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-sm sm:text-base text-gray-600">Package:</span>
                    <Badge variant="primary" className="text-xs sm:text-sm w-fit">
                      {camp.package.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-sm sm:text-base text-gray-600">Total Tennis Hours:</span>
                    <span className="font-semibold text-sm sm:text-base">{camp.total_tennis_hours || 'N/A'}</span>
                  </div>
                  {camp.coach && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-sm sm:text-base text-gray-600">Coach:</span>
                      <span className="font-semibold text-sm sm:text-base break-words">
                        {capitalizeName(camp.coach.first_name)} {capitalizeName(camp.coach.last_name)}
                      </span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Pre-Camp Assessment */}
            {user && (
              <Card>
                <CardBody>
                  <Link href="/player/assessment/form">
                    <Button variant={assessment ? "secondary" : "primary"} fullWidth>
                      {assessment ? 'Edit technical assessment' : 'Complete technical assessment'}
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            )}

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
                    No report available yet. Your coach will provide feedback after the camp.
                  </CardText>
                )}
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
