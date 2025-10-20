'use client';

import { useState, useEffect } from 'react';
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

export default function SinglePlayerPage({ params }: { params: { id: string } }) {
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
  const playerId = params.id;

  useEffect(() => {
    loadCurrentCoach();
    loadPlayerData();
  }, []);

  const loadCurrentCoach = async () => {
    try {
      // Get current user from localStorage (set during login)
      const userStr = localStorage.getItem('currentUser');
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

  const handleCreateReport = async (campId: string, answers: Record<string, string>) => {
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
          reportContent: JSON.stringify(answers),
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

  const handleUpdateReport = async (reportId: string, answers: Record<string, string>) => {
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
          reportContent: JSON.stringify(answers),
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
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Playing Experience:</p>
                          <p className="font-semibold">{assessment.answers.playing_experience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Skill Level:</p>
                          <p className="font-semibold capitalize">{assessment.answers.skill_level}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Dominant Hand:</p>
                          <p className="font-semibold capitalize">{assessment.answers.dominant_hand}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Goals:</p>
                          <p className="whitespace-pre-wrap">{assessment.answers.goals}</p>
                        </div>
                        {assessment.answers.strengths && (
                          <div>
                            <p className="text-sm text-gray-600">Strengths:</p>
                            <p className="whitespace-pre-wrap">{assessment.answers.strengths}</p>
                          </div>
                        )}
                        {assessment.answers.areas_to_improve && (
                          <div>
                            <p className="text-sm text-gray-600">Areas to Improve:</p>
                            <p className="whitespace-pre-wrap">{assessment.answers.areas_to_improve}</p>
                          </div>
                        )}
                        {assessment.answers.previous_injuries && (
                          <div>
                            <p className="text-sm text-gray-600">Previous Injuries:</p>
                            <p className="whitespace-pre-wrap">{assessment.answers.previous_injuries}</p>
                          </div>
                        )}
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
                        {/* Display Report Answers */}
                        {(() => {
                          try {
                            const answers = JSON.parse(report.report_content);
                            const questions = [
                              { id: 'performance_summary', label: 'Performance Summary' },
                              { id: 'technical_skills', label: 'Technical Skills Assessment' },
                              { id: 'areas_improved', label: 'Areas Improved During Camp' },
                              { id: 'strengths_showcased', label: 'Strengths Showcased' },
                              { id: 'recommendations', label: 'Recommendations for Future Training' },
                            ];
                            
                            return (
                              <div className="space-y-4 mb-4">
                                {questions.map((q, idx) => (
                                  <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">
                                      {idx + 1}. {q.label}
                                    </h4>
                                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                                      {answers[q.id] || 'No response provided'}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            );
                          } catch {
                            // Fallback for old text-based reports
                            return (
                              <div className="bg-gray-50 p-4 rounded-lg mb-3 whitespace-pre-wrap text-sm sm:text-base">
                                {report.report_content}
                              </div>
                            );
                          }
                        })()}
                        
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
                        existingAnswers={report ? (() => {
                          try {
                            return JSON.parse(report.report_content);
                          } catch {
                            return undefined;
                          }
                        })() : undefined}
                        onSubmit={(answers) => report ? handleUpdateReport(report.id, answers) : handleCreateReport(camp.id, answers)}
                        onCancel={cancelEditing}
                        isEditing={!!report}
                      />
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base">No report created yet. Create a comprehensive post-camp report for this player.</p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => startEditingReport(camp.id)}
                          className="w-full sm:w-auto"
                        >
                          Create Report
                        </Button>
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

