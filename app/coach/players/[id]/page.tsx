'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Collapsible } from '@/components/ui/Collapsible';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReportForm } from '@/components/features/ReportForm';
import { ArrowLeft } from 'lucide-react';

export default function SinglePlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const [player, setPlayer] = useState<any>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentCoach, setCurrentCoach] = useState<any>(null);
  const router = useRouter();
  const resolvedParams = React.use(params);
  const playerId = resolvedParams.id;

  useEffect(() => {
    loadCurrentCoach();
    loadPlayerData();
  }, []);

  const loadCurrentCoach = async () => {
    try {
      // Get current user from sessionStorage (set during login)
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentCoach(user);
      }
    } catch (error) {
      console.error('Error loading current coach:', error);
    }
  };

  const loadPlayerData = async () => {
    try {
      const response = await fetch(`/api/coach/players/${playerId}`);
      const data = await response.json();

      if (response.ok) {
        setPlayer(data.player);
        setCamps(data.camps || []);
        setAssessments(data.assessments || []);
        setReports(data.reports || []);
      } else {
        console.error('Error loading player data:', data.error);
        setError(data.error || 'Failed to load player data');
      }
    } catch (error) {
      console.error('Error loading player data:', error);
      setError('Failed to load player data');
    }
    setLoading(false);
  };

  const handleCreateReport = async (campId: string, answer: string) => {
    setError('');
    setSuccess('');

    if (!currentCoach) {
      setError('Coach information not found. Please log in again.');
      throw new Error('Coach not authenticated');
    }

    try {
      const response = await fetch('/api/coach/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          campId,
          reportContent: answer,
          coachId: currentCoach.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create report');
      }

      setSuccess('Report created successfully!');
      setEditingReport(null);
      loadPlayerData();
    } catch (err: any) {
      setError(err.message || 'Failed to create report');
      throw err;
    }
  };

  const handleUpdateReport = async (reportId: string, answer: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/coach/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          reportContent: answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update report');
      }

      setSuccess('Report updated successfully!');
      setEditingReport(null);
      loadPlayerData();
    } catch (err: any) {
      setError(err.message || 'Failed to update report');
      throw err;
    }
  };

  const startEditingReport = (campId: string) => {
    setEditingReport(campId);
    setError('');
    setSuccess('');
  };

  const cancelEditing = () => {
    setEditingReport(null);
    setError('');
    setSuccess('');
  };

  // Helper function to check if current date is within the last 2 days of camp
  const canCreateReport = (camp: any) => {
    const now = new Date();
    const campEndDate = new Date(camp.end_date);
    const twoDaysBeforeEnd = new Date(campEndDate);
    twoDaysBeforeEnd.setDate(campEndDate.getDate() - 2);
    
    // Can create report if current date is within the last 2 days of camp or after camp ends
    return now >= twoDaysBeforeEnd;
  };

  // Helper function to get days remaining until report creation is allowed
  const getDaysUntilReportAllowed = (camp: any) => {
    const now = new Date();
    const campEndDate = new Date(camp.end_date);
    const twoDaysBeforeEnd = new Date(campEndDate);
    twoDaysBeforeEnd.setDate(campEndDate.getDate() - 2);
    
    if (now >= twoDaysBeforeEnd) {
      return 0; // Can create report now
    }
    
    const diffTime = twoDaysBeforeEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="container mx-auto text-center py-12">
            Loading player details...
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!player) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="container mx-auto text-center py-12">
            <p>Player not found</p>
            <Link href="/coach/players">
              <Button variant="primary" className="mt-4">Back to Players</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <Link href="/coach/players" className="flex items-center gap-2 text-gray-600 hover:text-[#FF4C4C] mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Players
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 break-words">
          {player.first_name} {player.last_name}
        </h1>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}

        {/* Player Profile */}
        <Card className="mb-6">
          <CardBody>
            <CardTitle className="text-lg sm:text-xl">Player Profile</CardTitle>
            <div className="mt-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base text-gray-600">Username:</span>
                <span className="font-semibold text-sm sm:text-base break-words">{player.username}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base text-gray-600">Enrolled Camps:</span>
                <span className="font-semibold text-sm sm:text-base">{camps.length}</span>
              </div>
              {assessments.length > 0 && assessments[0]?.answers?.date_of_birth && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Date of Birth:</span>
                  <span className="font-semibold text-sm sm:text-base">
                    {new Date(assessments[0].answers.date_of_birth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {assessments.length > 0 && assessments[0]?.answers?.date_of_birth && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Age:</span>
                  <span className="font-semibold text-sm sm:text-base">
                    {(() => {
                      const birthDate = new Date(assessments[0].answers.date_of_birth);
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();
                      
                      // Adjust age if birthday hasn't occurred this year
                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                      }
                      
                      return `${age} years old`;
                    })()}
                  </span>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Camps with Assessments and Reports */}
        <div className="space-y-6">
          {camps.map((camp) => {
            const assessment = assessments.find(a => a.camp_id === camp.id);
            const report = reports.find(r => r.camp_id === camp.id);
            const isEditing = editingReport === camp.id;

            return (
              <Card key={camp.id} premium>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg break-words">
                        Camp: {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                      </CardTitle>
                      <Badge variant="primary" className="mt-2 text-xs sm:text-sm">
                        {camp.package.replace(/_/g, ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Pre-Camp Assessment */}
                  <Collapsible title="Pre-Camp Assessment" defaultOpen={false}>
                    {assessment ? (
                      <div className="space-y-4">
                        {/* Personal Information */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Personal Information</h4>
                          {assessment.answers.date_of_birth && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Date of Birth:</p>
                              <p className="font-semibold">
                                {new Date(assessment.answers.date_of_birth).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Playing Background */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Playing Background</h4>
                          {assessment.answers.playing_duration && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Playing Duration:</p>
                              <p className="font-semibold">{assessment.answers.playing_duration} years</p>
                            </div>
                          )}
                          {assessment.answers.monthly_frequency && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Monthly Frequency:</p>
                              <p className="font-semibold">{assessment.answers.monthly_frequency} times per month</p>
                            </div>
                          )}
                          {assessment.answers.competition_experience && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Competition Experience:</p>
                              <p className="font-semibold">{assessment.answers.competition_experience}</p>
                            </div>
                          )}
                          {assessment.answers.competition_level && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Competition Level:</p>
                              <p className="font-semibold">{assessment.answers.competition_level}</p>
                            </div>
                          )}
                        </div>

                        {/* Game Profile */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Game Profile</h4>
                          {assessment.answers.confident_aspects && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Confident Aspects:</p>
                              <p className="whitespace-pre-wrap">{assessment.answers.confident_aspects}</p>
                            </div>
                          )}
                          {assessment.answers.improvement_areas && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Areas to Improve:</p>
                              <p className="whitespace-pre-wrap">{assessment.answers.improvement_areas}</p>
                            </div>
                          )}
                        </div>

                        {/* Physical & Health */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Physical & Health</h4>
                          {assessment.answers.current_injuries && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Current Injuries:</p>
                              <p className="whitespace-pre-wrap">{assessment.answers.current_injuries}</p>
                            </div>
                          )}
                          {assessment.answers.discomfort_movements && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Discomfort Movements:</p>
                              <p className="whitespace-pre-wrap">{assessment.answers.discomfort_movements}</p>
                            </div>
                          )}
                          {assessment.answers.fitness_rating && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Fitness Rating:</p>
                              <p className="font-semibold">{assessment.answers.fitness_rating}/5</p>
                            </div>
                          )}
                        </div>

                        {/* Learning & Motivation */}
                        <div className="border-b pb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">Learning & Motivation</h4>
                          {assessment.answers.motivations && Array.isArray(assessment.answers.motivations) && assessment.answers.motivations.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Motivations:</p>
                              <p className="font-semibold">{assessment.answers.motivations.join(', ')}</p>
                            </div>
                          )}
                          {assessment.answers.learning_preferences && Array.isArray(assessment.answers.learning_preferences) && assessment.answers.learning_preferences.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Learning Preferences:</p>
                              <p className="font-semibold">{assessment.answers.learning_preferences.join(', ')}</p>
                            </div>
                          )}
                        </div>

                        {/* Goals & Expectations */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Goals & Expectations</h4>
                          {assessment.answers.main_goal && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Main Goal:</p>
                              <p className="whitespace-pre-wrap">{assessment.answers.main_goal}</p>
                            </div>
                          )}
                          {assessment.answers.additional_info && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600">Additional Information:</p>
                              <p className="whitespace-pre-wrap">{assessment.answers.additional_info}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="warning">Not completed yet</Badge>
                    )}
                  </Collapsible>

                  {/* Post-Camp Report */}
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-bold text-xl sm:text-2xl mb-4">Post-Camp Report</h3>
                    
                    {report && !isEditing ? (
                      <div>
                        {/* Display Report Answer */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                            Coach Feedback
                          </h4>
                          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                            {report.report_content || 'No feedback provided'}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingReport(camp.id)}
                            className="w-full sm:w-auto"
                          >
                            Edit Report
                          </Button>
                          <span className="text-xs sm:text-sm text-gray-500">
                            Last updated: {new Date(report.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ) : isEditing ? (
                      <ReportForm
                        existingAnswer={report ? report.report_content : undefined}
                        onSubmit={(answer) => report ? handleUpdateReport(report.id, answer) : handleCreateReport(camp.id, answer)}
                        onCancel={cancelEditing}
                        isEditing={!!report}
                      />
                    ) : (
                      <div>
                        {canCreateReport(camp) ? (
                          <>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">No report created yet. Create a comprehensive post-camp report for this player.</p>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => startEditingReport(camp.id)}
                              className="w-full sm:w-auto"
                            >
                              Create Report
                            </Button>
                          </>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm sm:text-base mb-2">
                              <strong>Report creation not yet available</strong>
                            </p>
                            <p className="text-yellow-700 text-sm">
                              You can create reports starting {getDaysUntilReportAllowed(camp) === 1 ? 'tomorrow' : `in ${getDaysUntilReportAllowed(camp)} days `} 
                              (2 days before camp ends on {new Date(camp.end_date).toLocaleDateString()}).
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {camps.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <CardText>This player is not enrolled in any of your camps.</CardText>
            </CardBody>
          </Card>
        )}
        </div>
      </div>
    </AppLayout>
  );
}

