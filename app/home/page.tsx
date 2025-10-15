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
  
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', options);
  
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

  useEffect(() => {
    // Get user from sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome, {user.first_name}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your tennis camp experience with ease
          </p>
        </div>

        {/* Role-based Content */}
        {user.role === 'player' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Camp Countdown */}
            {camps.length > 0 ? (
              camps.map((camp) => (
                <Card key={camp.id} className="bg-white shadow-lg">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="primary">{getPackageLabel(camp.package)}</Badge>
                      <Badge variant="secondary">{calculateCountdown(camp.start_date, camp.end_date)}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">Camp Session</CardTitle>
                    <CardText className="text-gray-600 mb-4">
                      {formatDateRange(camp.start_date, camp.end_date)}
                    </CardText>
                    <div className="space-y-2">
                      <Link href={`/camp/${camp.id}/tennis`}>
                        <Button variant="primary" fullWidth>
                          Tennis Program
                        </Button>
                      </Link>
                      <Link href={`/camp/${camp.id}/schedule`}>
                        <Button variant="outline" fullWidth>
                          Schedule
                        </Button>
                      </Link>
                      {camp.package !== 'tennis_only' && (
                        <Link href={`/camp/${camp.id}/stay`}>
                          <Button variant="outline" fullWidth>
                            Accommodation
                          </Button>
                        </Link>
                      )}
                      <Link href={`/camp/${camp.id}/essentials`}>
                        <Button variant="outline" fullWidth>
                          Essentials Guide
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white shadow-lg">
              <CardBody className="p-6">
                <CardTitle className="text-xl mb-4">My Players</CardTitle>
                <CardText className="text-gray-600 mb-4">
                  Manage and track your assigned players
                </CardText>
                <Link href="/coach/players">
                  <Button variant="primary" fullWidth>
                    View Players
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardBody className="p-6">
                <CardTitle className="text-xl mb-4">Reports</CardTitle>
                <CardText className="text-gray-600 mb-4">
                  Create and manage post-camp reports
                </CardText>
                <Link href="/coach/players">
                  <Button variant="outline" fullWidth>
                    Manage Reports
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white shadow-lg">
              <CardBody className="p-6">
                <CardTitle className="text-xl mb-4">User Management</CardTitle>
                <CardText className="text-gray-600 mb-4">
                  Create and manage users, players, and coaches
                </CardText>
                <Link href="/admin/users">
                  <Button variant="primary" fullWidth>
                    Manage Users
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardBody className="p-6">
                <CardTitle className="text-xl mb-4">Camp Management</CardTitle>
                <CardText className="text-gray-600 mb-4">
                  Create camps, assign coaches, and manage schedules
                </CardText>
                <Link href="/admin/camps">
                  <Button variant="primary" fullWidth>
                    Manage Camps
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardBody className="p-6">
                <CardTitle className="text-xl mb-4">System Overview</CardTitle>
                <CardText className="text-gray-600 mb-4">
                  View system statistics and reports
                </CardText>
                <Button variant="outline" fullWidth disabled>
                  Coming Soon
                </Button>
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