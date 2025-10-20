'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Collapsible } from '@/components/ui/Collapsible';
import { Camp, User, PackageType } from '@/types';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { AppLayout } from '@/components/layout/AppLayout';

export default function CampManagementPage() {
  const [camps, setCamps] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<User[]>([]);
  const [players, setPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [packageType, setPackageType] = useState<PackageType>('tennis_only');
  const [tennisHours, setTennisHours] = useState('10');
  const [accommodationDetails, setAccommodationDetails] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createServiceRoleClient();
    
    const { data: campsData } = await supabase
      .from('camps')
      .select(`
        *,
        coach:users!camps_coach_id_fkey (
          id,
          first_name,
          last_name
        )
      `)
      .order('start_date', { ascending: false });
    
    const { data: coachesData } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'coach');
    
    const { data: playersData } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'player');
    
    if (campsData) setCamps(campsData);
    if (coachesData) setCoaches(coachesData);
    if (playersData) setPlayers(playersData);
    setLoading(false);
  };

  const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const createCamp = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    if (selectedPlayers.length > parseInt(capacity)) {
      setError(`Cannot assign more than ${capacity} players`);
      return;
    }

    setError('');
    
    try {
      const supabase = createServiceRoleClient();

      // Create camp
      const { data: campData, error: campError } = await supabase
        .from('camps')
        .insert({
          start_date: startDate,
          end_date: endDate,
          package: packageType,
          total_tennis_hours: packageType === 'no_tennis' ? null : parseInt(tennisHours),
          accommodation_details: (packageType !== 'tennis_only') ? accommodationDetails : null,
          capacity: parseInt(capacity),
          coach_id: selectedCoach || null,
        })
        .select()
        .single();

      if (campError) throw campError;

      // Assign players
      if (selectedPlayers.length > 0) {
        const playerAssignments = selectedPlayers.map(playerId => ({
          camp_id: campData.id,
          player_id: playerId,
        }));

        const { error: playersError } = await supabase
          .from('camp_players')
          .insert(playerAssignments);

        if (playersError) throw playersError;
      }

      // Create schedules
      const dates = getDatesInRange(startDate, endDate);
      const scheduleInserts = dates
        .filter(date => schedules[date]?.trim())
        .map(date => ({
          camp_id: campData.id,
          schedule_date: date,
          schedule_content: schedules[date],
        }));

      if (scheduleInserts.length > 0) {
        const { error: scheduleError } = await supabase
          .from('camp_schedules')
          .insert(scheduleInserts);

        if (scheduleError) throw scheduleError;
      }

      setSuccess('Camp created successfully!');
      resetForm();
      loadData();
      setTimeout(() => setShowCreateModal(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create camp');
    }
  };

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setPackageType('tennis_only');
    setTennisHours('10');
    setAccommodationDetails('');
    setCapacity('4');
    setSelectedCoach('');
    setSelectedPlayers([]);
    setSchedules({});
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      if (selectedPlayers.length < parseInt(capacity)) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };

  const getPackageLabel = (pkg: string): string => {
    const labels: Record<string, string> = {
      'tennis_only': 'Tennis Only',
      'stay_and_play': 'Stay & Play',
      'luxury_stay_and_play': 'Luxury Stay & Play',
      'no_tennis': 'No Tennis'
    };
    return labels[pkg] || pkg;
  };

  const getCampStatus = (camp: any): string => {
    const now = new Date();
    const start = new Date(camp.start_date);
    const end = new Date(camp.end_date);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'in-progress';
  };

  const dates = startDate && endDate ? getDatesInRange(startDate, endDate) : [];

  return (
    <AppLayout>
      <div className="p-8">
        <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">Camp Management</h1>
          <Button variant="primary" onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            Create New Camp
          </Button>
        </div>

        {/* Camps Grid */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="row">
            {camps.map((camp) => (
              <div key={camp.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <Card hover>
                  <CardBody>
                    <CardTitle className="text-base sm:text-lg break-words">
                      {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary" className="text-xs sm:text-sm">{getPackageLabel(camp.package)}</Badge>
                      <Badge variant={
                        getCampStatus(camp) === 'upcoming' ? 'info' :
                        getCampStatus(camp) === 'in-progress' ? 'warning' : 'secondary'
                      } className="text-xs sm:text-sm">
                        {getCampStatus(camp)}
                      </Badge>
                    </div>
                    <CardText className="mb-2 text-sm sm:text-base">
                      Capacity: {camp.capacity} players
                    </CardText>
                    {camp.coach && (
                      <CardText className="text-sm sm:text-base">
                        Coach: {camp.coach.first_name}
                      </CardText>
                    )}
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Camp Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Create New Camp</h2>
              
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              {success && <Alert variant="success" className="mb-4">{success}</Alert>}
              
              <div className="space-y-4">
                {/* Dates */}
                <div className="row">
                  <div className="col-12 col-md-6">
                    <Input
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <Input
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Package Type */}
                <Select
                  label="Package Type"
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value as PackageType)}
                  options={[
                    { value: 'tennis_only', label: 'Tennis Only' },
                    { value: 'stay_and_play', label: 'Stay & Play' },
                    { value: 'luxury_stay_and_play', label: 'Luxury Stay & Play' },
                    { value: 'no_tennis', label: 'No Tennis' },
                  ]}
                />

                {/* Tennis Hours */}
                {packageType !== 'no_tennis' && (
                  <Input
                    label="Total Tennis Hours (0-20)"
                    type="number"
                    min="0"
                    max="20"
                    value={tennisHours}
                    onChange={(e) => setTennisHours(e.target.value)}
                  />
                )}

                {/* Accommodation Details */}
                {packageType !== 'tennis_only' && (
                  <Textarea
                    label="Accommodation Details"
                    value={accommodationDetails}
                    onChange={(e) => setAccommodationDetails(e.target.value)}
                    rows={6}
                    placeholder="Enter hotel name, address, check-in/out times, amenities, contact information..."
                    helperText="Include: hotel name, address, check-in/out times, amenities, contact info"
                  />
                )}

                {/* Capacity */}
                <Input
                  label="Capacity (1-4 players)"
                  type="number"
                  min="1"
                  max="4"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />

                {/* Coach Selection */}
                <Select
                  label="Assign Coach (Optional)"
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  options={[
                    { value: '', label: 'No coach assigned' },
                    ...coaches.map(coach => ({
                      value: coach.id,
                      label: coach.first_name
                    }))
                  ]}
                />

                {/* Player Assignment */}
                <div>
                  <label className="form-label">
                    Assign Players ({selectedPlayers.length}/{capacity})
                  </label>
                  <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                    {players.map(player => (
                      <label key={player.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPlayers.includes(player.id)}
                          onChange={() => togglePlayerSelection(player.id)}
                          disabled={!selectedPlayers.includes(player.id) && selectedPlayers.length >= parseInt(capacity)}
                        />
                        <span>{player.first_name} {player.last_name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Daily Schedules */}
                {dates.length > 0 && (
                  <div>
                    <label className="form-label mb-3">Daily Schedules (Optional)</label>
                    <div className="space-y-2">
                      {dates.map(date => (
                        <Collapsible
                          key={date}
                          title={new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        >
                          <Textarea
                            value={schedules[date] || ''}
                            onChange={(e) => setSchedules({ ...schedules, [date]: e.target.value })}
                            rows={4}
                            placeholder="Enter schedule for this day (e.g., • 10:00 Tennis Lesson • Afternoon: City Tour)"
                          />
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                <Button variant="outline" fullWidth onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={createCamp}>
                  Create Camp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
}

