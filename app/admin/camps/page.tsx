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
import { AppLayout } from '@/components/layout/AppLayout';

export default function CampManagementPage() {
  const [camps, setCamps] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<User[]>([]);
  const [players, setPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCamp, setEditingCamp] = useState<any>(null);
  
  // Form state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [packageType, setPackageType] = useState<PackageType>('tennis_only');
  const [tennisHours, setTennisHours] = useState('10');
  const [accommodationDetails, setAccommodationDetails] = useState('');
  const [accommodationName, setAccommodationName] = useState('');
  const [accommodationPhone, setAccommodationPhone] = useState('');
  const [accommodationMapLink, setAccommodationMapLink] = useState('');
  const [accommodationPhoto, setAccommodationPhoto] = useState<File | null>(null);
  const [accommodationPhotoPreview, setAccommodationPhotoPreview] = useState<string | null>(null);
  const [capacity, setCapacity] = useState('4');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedCampId, setCopiedCampId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/admin/camps');
      const data = await response.json();
      
      if (response.ok) {
        setCamps(data.camps);
        setCoaches(data.coaches);
        setPlayers(data.players);
      } else {
        console.error('Error loading data:', data.error);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
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

    // Validate accommodation fields for stay packages
    if (packageType !== 'tennis_only' && packageType !== 'no_tennis') {
      if (!accommodationName.trim()) {
        setError('Accommodation name is required for stay packages');
        return;
      }
      if (!accommodationPhone.trim()) {
        setError('Accommodation phone number is required for stay packages');
        return;
      }
    }

    setError('');
    
    try {
      // Upload photo if provided
      let photoUrl = null;
      if (accommodationPhoto) {
        const formData = new FormData();
        formData.append('photo', accommodationPhoto);
        formData.append('type', 'accommodation');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          photoUrl = uploadData.url;
        } else {
          const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }));
          setError(`Failed to upload accommodation photo: ${errorData.error || 'Unknown error'}`);
          return;
        }
      }

      const response = await fetch('/api/admin/camps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          packageType,
          tennisHours,
          accommodationDetails,
          accommodationName,
          accommodationPhone,
          accommodationMapLink,
          accommodationPhotoUrl: photoUrl,
          capacity,
          selectedCoach,
          selectedPlayers,
          schedules,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Camp created successfully!');
        resetForm();
        loadData();
        setTimeout(() => setShowCreateModal(false), 2000);
      } else {
        setError(data.error || 'Failed to create camp');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create camp');
    }
  };

  const editCamp = async () => {
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

    // Validate accommodation fields for stay packages
    if (packageType !== 'tennis_only' && packageType !== 'no_tennis') {
      if (!accommodationName.trim()) {
        setError('Accommodation name is required for stay packages');
        return;
      }
      if (!accommodationPhone.trim()) {
        setError('Accommodation phone number is required for stay packages');
        return;
      }
    }

    setError('');
    
    try {
      // Upload photo if provided
      let photoUrl = accommodationPhotoPreview; // Keep existing photo if no new one uploaded
      if (accommodationPhoto) {
        const formData = new FormData();
        formData.append('photo', accommodationPhoto);
        formData.append('type', 'accommodation');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          photoUrl = uploadData.url;
        } else {
          const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }));
          setError(`Failed to upload accommodation photo: ${errorData.error || 'Unknown error'}`);
          return;
        }
      }

      const response = await fetch('/api/admin/camps', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campId: editingCamp.id,
          startDate,
          endDate,
          packageType,
          tennisHours,
          accommodationDetails,
          accommodationName,
          accommodationPhone,
          accommodationMapLink,
          accommodationPhotoUrl: photoUrl,
          capacity,
          selectedCoach,
          selectedPlayers,
          schedules,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Camp updated successfully!');
        resetForm();
        loadData();
        setTimeout(() => {
          setShowEditModal(false);
          setEditingCamp(null);
        }, 2000);
      } else {
        setError(data.error || 'Failed to update camp');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update camp');
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAccommodationPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAccommodationPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setPackageType('tennis_only');
    setTennisHours('10');
    setAccommodationDetails('');
    setAccommodationName('');
    setAccommodationPhone('');
    setAccommodationMapLink('');
    setAccommodationPhoto(null);
    setAccommodationPhotoPreview(null);
    setCapacity('4');
    setSelectedCoach('');
    setSelectedPlayers([]);
    setSchedules({});
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingCamp(null);
    resetForm();
  };

  const openEditModal = (camp: any) => {
    setEditingCamp(camp);
    
    // Populate form with existing data
    setStartDate(camp.start_date);
    setEndDate(camp.end_date);
    setPackageType(camp.package);
    setTennisHours(camp.total_tennis_hours?.toString() || '10');
    setAccommodationDetails(camp.accommodation_details || '');
    setAccommodationName(camp.accommodation_name || '');
    setAccommodationPhone(camp.accommodation_phone || '');
    setAccommodationMapLink(camp.accommodation_map_link || '');
    setAccommodationPhotoPreview(camp.accommodation_photo_url || null);
    setCapacity(camp.capacity.toString());
    setSelectedCoach(camp.coach_id || '');
    
    // Set selected players
    const playerIds = camp.camp_players?.map((cp: any) => cp.player_id) || [];
    setSelectedPlayers(playerIds);
    
    // Set schedules
    const scheduleData: Record<string, string> = {};
    camp.camp_schedules?.forEach((schedule: any) => {
      scheduleData[schedule.schedule_date] = schedule.schedule_content;
    });
    setSchedules(scheduleData);
    
    setShowEditModal(true);
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
      <div className="p-4 sm:p-6 md:p-8">
        <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Camp Management</h1>
          <Button variant="secondary" onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
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
                      <Badge variant="success" className="text-xs sm:text-sm">{getPackageLabel(camp.package)}</Badge>
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
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Camp ID &amp; registration link</p>
                      <p className="text-xs text-gray-700 truncate" title={camp.id}>ID: {camp.id}</p>
                      <p className="text-xs text-gray-700 truncate" title={typeof window !== 'undefined' ? `${window.location.origin}/register/${camp.id}` : `/register/${camp.id}`}>
                        /register/{camp.id}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <a
                          href={`/register/${camp.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#2563EB] hover:underline"
                        >
                          Open link
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const url = typeof window !== 'undefined' ? `${window.location.origin}/register/${camp.id}` : `/register/${camp.id}`;
                            navigator.clipboard?.writeText(url).then(
                              () => { setCopiedCampId(camp.id); setTimeout(() => setCopiedCampId(null), 2000); },
                              () => {}
                            );
                          }}
                          className="text-xs text-[#2563EB] hover:underline"
                        >
                          {copiedCampId === camp.id ? 'Copied!' : 'Copy link'}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEditModal(camp)}
                        className="w-full"
                      >
                        Edit Camp
                      </Button>
                    </div>
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

                {/* Accommodation Section */}
                {packageType !== 'tennis_only' && (
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Accommodation Information</h3>
                      
                      {/* Accommodation Name */}
                      <Input
                        label="Accommodation Name *"
                        value={accommodationName}
                        onChange={(e) => setAccommodationName(e.target.value)}
                        placeholder="e.g., Hotel Riad Dar Karma"
                        helperText="Name of the hotel or accommodation"
                      />

                      {/* Phone Number */}
                      <Input
                        label="Phone Number *"
                        value={accommodationPhone}
                        onChange={(e) => setAccommodationPhone(e.target.value)}
                        placeholder="e.g., +212 5XX-XXXXXX"
                        helperText="Contact phone number for the accommodation"
                      />

                      {/* Google Maps Link */}
                      <Input
                        label="Google Maps Link"
                        value={accommodationMapLink}
                        onChange={(e) => setAccommodationMapLink(e.target.value)}
                        placeholder="https://www.google.com/maps/place/..."
                        helperText="Paste the Google Maps link for easy navigation"
                      />

                      {/* Photo Upload */}
                      <div>
                        <label className="form-label">Accommodation Photo</label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          />
                          {accommodationPhotoPreview && (
                            <div className="mt-2">
                              <img
                                src={accommodationPhotoPreview}
                                alt="Accommodation preview"
                                className="w-full max-w-xs h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Upload a photo of the accommodation (optional)</p>
                      </div>

                      {/* Details */}
                      <Textarea
                        label="Accommodation Details"
                        value={accommodationDetails}
                        onChange={(e) => setAccommodationDetails(e.target.value)}
                        rows={6}
                        placeholder="Enter detailed information about the accommodation, amenities, check-in/out times, policies, etc..."
                        helperText="Include: amenities, check-in/out times, policies, special instructions"
                      />
                    </div>
                  </div>
                )}

                {/* Capacity */}
                <Input
                  label="Capacity (1-8 players)"
                  type="number"
                  min="1"
                  max="8"
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

      {/* Edit Camp Modal */}
      {showEditModal && editingCamp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Edit Camp</h2>
              
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

                {/* Accommodation Section */}
                {packageType !== 'tennis_only' && (
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Accommodation Information</h3>
                      
                      {/* Accommodation Name */}
                      <Input
                        label="Accommodation Name *"
                        value={accommodationName}
                        onChange={(e) => setAccommodationName(e.target.value)}
                        placeholder="e.g., Hotel Riad Dar Karma"
                        helperText="Name of the hotel or accommodation"
                      />

                      {/* Phone Number */}
                      <Input
                        label="Phone Number *"
                        value={accommodationPhone}
                        onChange={(e) => setAccommodationPhone(e.target.value)}
                        placeholder="e.g., +212 5XX-XXXXXX"
                        helperText="Contact phone number for the accommodation"
                      />

                      {/* Google Maps Link */}
                      <Input
                        label="Google Maps Link"
                        value={accommodationMapLink}
                        onChange={(e) => setAccommodationMapLink(e.target.value)}
                        placeholder="https://www.google.com/maps/place/..."
                        helperText="Paste the Google Maps link for easy navigation"
                      />

                      {/* Photo Upload */}
                      <div>
                        <label className="form-label">Accommodation Photo</label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                          />
                          {accommodationPhotoPreview && (
                            <div className="mt-2">
                              <img
                                src={accommodationPhotoPreview}
                                alt="Accommodation preview"
                                className="w-full max-w-xs h-32 object-cover rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Upload a photo of the accommodation (optional)</p>
                      </div>

                      {/* Details */}
                      <Textarea
                        label="Accommodation Details"
                        value={accommodationDetails}
                        onChange={(e) => setAccommodationDetails(e.target.value)}
                        rows={6}
                        placeholder="Enter detailed information about the accommodation, amenities, check-in/out times, policies, etc..."
                        helperText="Include: amenities, check-in/out times, policies, special instructions"
                      />
                    </div>
                  </div>
                )}

                {/* Capacity */}
                <Input
                  label="Capacity (1-8 players)"
                  type="number"
                  min="1"
                  max="8"
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
                <Button variant="primary" fullWidth onClick={editCamp}>
                  Update Camp
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

