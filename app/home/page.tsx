'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/types';
import Link from 'next/link';

function calculateCountdown(startDate: string, endDate: string): string {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time to midnight for accurate day calculation
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  if (now < start) {
    const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `D-${daysUntil}`;
  } else if (now >= start && now <= end) {
    const currentDay = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `Day ${currentDay} of ${totalDays}`;
  } else {
    return 'Completed';
  }
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Use shorter format for better mobile display
  // Mobile will show: "Nov 22 - Nov 25, 2025"
  // Desktop will show: "November 22, 2025 - November 25, 2025"
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
}

function getPackageLabel(packageType: string): string {
  const labels: Record<string, string> = {
    'tennis_only': 'Tennis Only',
    'stay_and_play': 'Stay & Play',
    'luxury_stay_and_play': 'Luxury Stay & Play',
    'no_tennis': 'No Tennis'
  };
  return labels[packageType] || packageType;
}

function HomePageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [coachData, setCoachData] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // Load data based on user role
      if (userData.role === 'player') {
        loadPlayerData(userData.id);
      } else if (userData.role === 'coach') {
        loadCoachData(userData.id);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const loadPlayerData = async (userId: string) => {
    try {
      // Load both camps and assessment data in parallel
      const [campsResponse, assessmentResponse] = await Promise.all([
        fetch(`/api/player/camps?userId=${userId}`),
        fetch(`/api/player/assessment?userId=${userId}`)
      ]);

      // Handle camps data
      if (campsResponse.ok) {
        const campsData = await campsResponse.json();
        setCamps(campsData.camps || []);
      } else {
        console.error('Error loading player camps:', campsResponse.status);
      }

      // Handle assessment data
      if (assessmentResponse.ok) {
        const assessmentData = await assessmentResponse.json();
        setAssessmentData(assessmentData);
      } else {
        console.error('Error loading player assessment:', assessmentResponse.status);
      }
    } catch (error) {
      console.error('Error loading player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCoachData = async (coachId: string) => {
    try {
      const response = await fetch(`/api/coach/camps?coachId=${coachId}`);
      const data = await response.json();
      
      if (response.ok) {
        setCoachData(data);
      } else {
        console.error('Error loading coach data:', data.error);
      }
    } catch (error) {
      console.error('Error loading coach data:', error);
    }
    setLoading(false);
  };

  if (!user || loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            Welcome, {user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1).toLowerCase()}!
          </h1>
          {user.role === 'coach' && coachData ? (
            <div className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              <p className="mb-2">
                You have <span className="font-semibold text-[#2563EB]">{coachData.totalCamps}</span> camp{coachData.totalCamps !== 1 ? 's' : ''} assigned
              </p>
              {coachData.upcomingCampsCount > 0 ? (
                <p className="text-lg">
                  {coachData.upcomingCampsCount === 1 ? (
                    <>You have <span className="font-semibold text-[#FF4C4C]">1 upcoming camp</span> starting on{' '}
                      <span className="font-semibold text-[#FF4C4C]">
                        {(() => {
                          const date = new Date(coachData.nextUpcomingCamp.start_date);
                          const options: Intl.DateTimeFormatOptions = { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          };
                          return date.toLocaleDateString('en-US', options);
                        })()}
                      </span>
                    </>
                  ) : (
                    <>You have <span className="font-semibold text-[#FF4C4C]">{coachData.upcomingCampsCount} upcoming camps</span>. Your next camp starts on{' '}
                      <span className="font-semibold text-[#FF4C4C]">
                        {(() => {
                          const date = new Date(coachData.nextUpcomingCamp.start_date);
                          const options: Intl.DateTimeFormatOptions = { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          };
                          return date.toLocaleDateString('en-US', options);
                        })()}
                      </span>
                    </>
                  )}
                </p>
              ) : (
                <p className="text-lg text-gray-500">
                  No upcoming camps scheduled at this time.
                </p>
              )}
            </div>
          ) : user.role === 'player' && camps.length > 0 ? (
            <div className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {(() => {
                const now = new Date();
                const upcomingCamps = camps.filter(camp => new Date(camp.start_date) >= now);
                const nextCamp = upcomingCamps.length > 0 ? upcomingCamps[0] : null;
                
                if (nextCamp) {
                  const daysUntil = Math.ceil((new Date(nextCamp.start_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div>
                      <p className="mb-2">
                        🎉 Your camp starts in <span className="font-semibold text-[#FF4C4C]">{daysUntil}</span> day{daysUntil !== 1 ? 's' : ''}
                      </p>
                      <p className="mb-2 font-semibold text-[#2563EB] text-lg md:text-xl">
                        {(() => {
                          const date = new Date(nextCamp.start_date);
                          const options: Intl.DateTimeFormatOptions = { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          };
                          return date.toLocaleDateString('en-US', options);
                        })()}
                      </p>
                      
                      {/* Assessment Section */}
                      {assessmentData && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          {assessmentData.hasAssessment ? (
                            <div>
                              <p className="text-gray-600 mb-3">
                                You have completed your technical assessment.
                              </p>
                              <Link href="/player/assessment/form">
                                <Button variant="secondary" className="w-full sm:w-auto">
                                  Edit technical assessment
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div>
                              <p className="text-gray-600 mb-3">
                                Please complete your assessment for the coach to design sessions focused on you and your goals
                              </p>
                              <Link href="/player/assessment/form">
                                <Button variant="primary" className="w-full sm:w-auto">
                                  Complete technical assessment
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your tennis camp experience with ease
            </p>
          )}
        </div>

        {/* Role-based Content */}
        {user.role === 'player' && (
          <div className={`grid gap-4 sm:gap-6 ${camps.length === 1 ? 'justify-center max-w-md mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {/* Camp Countdown */}
            {camps.length > 0 ? (
              camps.map((camp) => (
                <Card key={camp.id} className="bg-white shadow-lg">
                  <CardBody className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="success" className="text-xs sm:text-sm">{getPackageLabel(camp.package)}</Badge>
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {camp.total_tennis_hours ? `${camp.total_tennis_hours}h Tennis` : 'No Tennis'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg sm:text-xl mb-4 break-words">{formatDateRange(camp.start_date, camp.end_date)}</CardTitle>
                    <div className="space-y-3">
                      <Link href={`/camp/${camp.id}/tennis`}>
                        <Button variant="primary" fullWidth className="text-sm sm:text-base">
                          Tennis program
                        </Button>
                      </Link>
                      {camp.package !== 'tennis_only' && (
                        <Link href={`/camp/${camp.id}/stay`}>
                          <Button variant="outline" fullWidth className="text-sm sm:text-base">
                            Accommodation
                          </Button>
                        </Link>
                      )}
                      <Link href={`/camp/${camp.id}/essentials`}>
                        <Button variant="secondary" fullWidth className="text-sm sm:text-base">
                          Essentials guide
                        </Button>
                      </Link>
                      <Link href={`/camp/${camp.id}/schedule`}>
                        <Button variant="outline" fullWidth className="text-sm sm:text-base">
                          Schedule
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card className="bg-white shadow-lg md:col-span-2 lg:col-span-3">
                <CardBody className="p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">No Active Camps</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any active camp enrollments at the moment.
                  </p>
                  <p className="text-sm text-gray-500">
                    Contact your administrator if you believe this is an error.
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {user.role === 'coach' && (
          <div className={`grid gap-4 sm:gap-6 ${coachData?.totalCamps === 1 ? 'justify-center max-w-md mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            <Card className="bg-white shadow-lg">
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">My Players</CardTitle>
                <CardText className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Manage and track your assigned players, create reports
                </CardText>
                <Link href="/coach/players">
                  <Button variant="primary" fullWidth className="text-sm sm:text-base">
                    View Players
                  </Button>
                </Link>
              </CardBody>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">Tennis Camps</CardTitle>
                <CardText className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  View all your camp schedules and details
                </CardText>
                <Link href="/coach/camps">
                  <Button variant="primary" fullWidth className="text-sm sm:text-base">
                    View Camps
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="grid gap-4 sm:gap-6 justify-center md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white shadow-lg">
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">User Management</CardTitle>
                <CardText className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Create and manage users, players, and coaches
                </CardText>
                <Link href="/admin/users">
                  <Button variant="primary" fullWidth className="text-sm sm:text-base">
                    Manage Users
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">Camp Management</CardTitle>
                <CardText className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Create camps, assign coaches, and manage schedules
                </CardText>
                <Link href="/admin/camps">
                  <Button variant="secondary" fullWidth className="text-sm sm:text-base">
                    Manage Camps
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">Registrations</CardTitle>
                <CardText className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Confirm Revolut payments once received
                </CardText>
                <Link href="/admin/registrations">
                  <Button variant="outline" fullWidth className="text-sm sm:text-base">
                    View registrations
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-3 sm:mb-4">Player Feedback</CardTitle>
                <CardText className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  View and manage all player feedback submissions
                </CardText>
                <Link href="/admin/feedback">
                  <Button variant="primary" fullWidth className="text-sm sm:text-base">
                    View Feedback
                  </Button>
                </Link>
              </CardBody>
            </Card>

          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}