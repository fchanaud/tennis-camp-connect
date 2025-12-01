'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { Collapsible } from '@/components/ui/Collapsible';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';

interface CampSchedule {
  id: string;
  schedule_date: string;
  schedule_content: string;
  created_at: string;
  updated_at: string;
}

interface Player {
  id: string;
  first_name: string;
  last_name: string;
}

interface Camp {
  id: string;
  start_date: string;
  end_date: string;
  package: string;
  total_tennis_hours: number | null;
  accommodation_details: string | null;
  accommodation_name: string | null;
  accommodation_phone?: string | null;
  accommodation_map_link?: string | null;
  capacity: number;
  coach_id: string | null;
  created_at: string;
  camp_players?: Array<{
    player_id: string;
    player: Player;
  }>;
  camp_schedules?: CampSchedule[];
}

export default function CampsListPage() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCamps();
  }, []);

  const loadCamps = async () => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        setError('User not found. Please log in again.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch(`/api/coach/camps?coachId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setCamps(data.camps || []);
      } else {
        setError(data.error || 'Failed to load camps');
      }
    } catch (error) {
      console.error('Error loading camps:', error);
      setError('Failed to load camps');
    } finally {
      setLoading(false);
    }
  };

  const getPackageLabel = (pkg: string): string => {
    const labels: Record<string, string> = {
      'tennis_only': 'Tennis Only',
      'stay_and_play': 'Stay & Play',
      'luxury_stay_and_play': 'Luxury Stay & Play',
      'no_tennis': 'No Tennis'
    };
    return labels[pkg] || pkg.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const getCampStatus = (camp: Camp): 'upcoming' | 'in-progress' | 'completed' => {
    const now = new Date();
    const start = new Date(camp.start_date);
    const end = new Date(camp.end_date);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'in-progress';
  };

  const formatDateRange = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getPlayerCount = (camp: Camp): number => {
    return camp.camp_players?.length || 0;
  };

  const getPlayerNames = (camp: Camp): string => {
    if (!camp.camp_players || camp.camp_players.length === 0) {
      return 'No players assigned';
    }
    return camp.camp_players.map(cp => `${cp.player.first_name} ${cp.player.last_name}`).join(', ');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-8">
          <div className="container mx-auto text-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading camps...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-8">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">All Tennis Camps</h1>

          {error && (
            <Alert variant="danger" className="mb-4 sm:mb-6">
              {error}
            </Alert>
          )}

          {camps.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8 sm:py-12">
                <h2 className="text-lg sm:text-xl font-semibold mb-2">No Camps Found</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  You don't have any camps assigned yet.
                </p>
              </CardBody>
            </Card>
          ) : (
            <>
              {/* Mobile & Tablet View - Cards */}
              <div className="block xl:hidden space-y-4 sm:space-y-6">
                {camps.map((camp) => {
                  const status = getCampStatus(camp);
                  const playerCount = getPlayerCount(camp);
                  
                  return (
                    <Card key={camp.id} className="hover:shadow-lg transition-shadow">
                      <CardBody className="p-4 sm:p-6">
                        {/* Camp Header */}
                        <div className="mb-4 pb-4 border-b">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">
                                {formatDateRange(camp.start_date, camp.end_date)}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="primary" className="text-xs sm:text-sm">
                                  {getPackageLabel(camp.package)}
                                </Badge>
                                <Badge 
                                  variant={
                                    status === 'upcoming' ? 'info' :
                                    status === 'in-progress' ? 'warning' : 'secondary'
                                  }
                                  className="text-xs sm:text-sm"
                                >
                                  {status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Camp Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {camp.total_tennis_hours && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span>{camp.total_tennis_hours} hours</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4 flex-shrink-0" />
                              <span>{playerCount} {playerCount === 1 ? 'player' : 'players'}</span>
                            </div>
                            {camp.accommodation_details && (
                              <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{camp.accommodation_name || 'Accommodation included'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Players List */}
                        {playerCount > 0 && (
                          <div className="mb-4 pb-4 border-b">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                              Players
                            </h4>
                            <p className="text-sm text-gray-700 break-words">
                              {getPlayerNames(camp)}
                            </p>
                          </div>
                        )}

                        {/* Schedules */}
                        {camp.camp_schedules && camp.camp_schedules.length > 0 ? (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Daily Schedule
                            </h4>
                            <div className="space-y-2">
                              {camp.camp_schedules.map((schedule) => (
                                <Collapsible
                                  key={schedule.id}
                                  title={new Date(schedule.schedule_date).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                  defaultOpen={false}
                                >
                                  <div className="pt-3">
                                    <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                                      {schedule.schedule_content}
                                    </div>
                                  </div>
                                </Collapsible>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            No schedule available yet
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop View - Enhanced Layout */}
              <div className="hidden xl:block">
                <div className="grid gap-6">
                  {camps.map((camp) => {
                    const status = getCampStatus(camp);
                    const playerCount = getPlayerCount(camp);
                    
                    return (
                      <Card key={camp.id} className="hover:shadow-lg transition-shadow">
                        <CardBody className="p-6">
                          <div className="grid grid-cols-12 gap-6">
                            {/* Left Column - Camp Info */}
                            <div className="col-span-12 lg:col-span-4">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="font-bold text-xl text-gray-900 mb-3">
                                    {formatDateRange(camp.start_date, camp.end_date)}
                                  </h3>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="primary" className="text-sm">
                                      {getPackageLabel(camp.package)}
                                    </Badge>
                                    <Badge 
                                      variant={
                                        status === 'upcoming' ? 'info' :
                                        status === 'in-progress' ? 'warning' : 'secondary'
                                      }
                                      className="text-sm"
                                    >
                                      {status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Camp Details */}
                              <div className="space-y-3 mb-4">
                                {camp.total_tennis_hours && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">{camp.total_tennis_hours} tennis hours</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="w-5 h-5 flex-shrink-0" />
                                  <span className="text-sm">{playerCount} {playerCount === 1 ? 'player' : 'players'}</span>
                                </div>
                                {camp.accommodation_details && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm">{camp.accommodation_name || 'Accommodation included'}</span>
                                  </div>
                                )}
                              </div>

                              {/* Players List */}
                              {playerCount > 0 && (
                                <div className="pt-4 border-t">
                                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    Players
                                  </h4>
                                  <p className="text-sm text-gray-700 break-words">
                                    {getPlayerNames(camp)}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Right Column - Schedules */}
                            <div className="col-span-12 lg:col-span-8">
                              {camp.camp_schedules && camp.camp_schedules.length > 0 ? (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Daily Schedule
                                  </h4>
                                  <div className="space-y-3">
                                    {camp.camp_schedules.map((schedule) => (
                                      <Collapsible
                                        key={schedule.id}
                                        title={new Date(schedule.schedule_date).toLocaleDateString('en-US', { 
                                          weekday: 'long', 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })}
                                        defaultOpen={false}
                                      >
                                        <div className="pt-4">
                                          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                                            {schedule.schedule_content}
                                          </div>
                                        </div>
                                      </Collapsible>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-400">
                                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                  <p className="text-sm italic">No schedule available yet</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 sm:mt-6 text-sm text-gray-600">
                Showing {camps.length} {camps.length === 1 ? 'camp' : 'camps'}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

