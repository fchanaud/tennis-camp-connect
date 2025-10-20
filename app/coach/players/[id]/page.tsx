'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Collapsible } from '@/components/ui/Collapsible';
import { AppLayout } from '@/components/layout/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';

export default function SinglePlayerPage({ params }: { params: { id: string } }) {
  const [player, setPlayer] = useState<any>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const playerId = params.id;

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
    const supabase = createClient();

    // Get current coach user
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    // Get player details
    const { data: playerData } = await supabase
      .from('users')
      .select('*')
      .eq('id', playerId)
      .single();

    if (!playerData) {
      setLoading(false);
      return;
    }

    setPlayer(playerData);

    // Get player's camps (only those where current user is coach)
    const { data: campPlayersData } = await supabase
      .from('camp_players')
      .select(`
        camp_id,
        camps!inner (
          id,
          start_date,
          end_date,
          package,
          total_tennis_hours,
          coach_id
        )
      `)
      .eq('player_id', playerId)
      .eq('camps.coach_id', authUser.id);

    const playerCamps = (campPlayersData
      ?.map((cp: any) => cp.camps)
      .filter((camp: any) => camp !== null) || []) as any[];

    setCamps(playerCamps);

    // Get assessments for these camps
    const campIds = playerCamps.map((c: any) => c.id);
    const { data: assessmentsData } = await supabase
      .from('pre_camp_assessments')
      .select('*')
      .eq('player_id', playerId)
      .in('camp_id', campIds);

    setAssessments(assessmentsData || []);

    // Get reports for these camps
    const { data: reportsData } = await supabase
      .from('post_camp_reports')
      .select('*')
      .eq('player_id', playerId)
      .in('camp_id', campIds);

    setReports(reportsData || []);
    setLoading(false);
  };

  const handleCreateReport = async (campId: string) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { error: insertError } = await supabase
        .from('post_camp_reports')
        .insert({
          player_id: playerId,
          camp_id: campId,
          coach_id: authUser.id,
          report_content: reportContent,
        });

      if (insertError) throw insertError;

      setSuccess('Report created successfully!');
      setEditingReport(null);
      setReportContent('');
      loadPlayerData();
    } catch (err: any) {
      setError(err.message || 'Failed to create report');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateReport = async (reportId: string) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('post_camp_reports')
        .update({
          report_content: reportContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (updateError) throw updateError;

      setSuccess('Report updated successfully!');
      setEditingReport(null);
      setReportContent('');
      loadPlayerData();
    } catch (err: any) {
      setError(err.message || 'Failed to update report');
    } finally {
      setSaving(false);
    }
  };

  const startEditingReport = (campId: string, existingContent?: string) => {
    setEditingReport(campId);
    setReportContent(existingContent || '');
    setError('');
    setSuccess('');
  };

  const cancelEditing = () => {
    setEditingReport(null);
    setReportContent('');
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
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-lg mb-3">Post-Camp Report</h3>
                    
                    {report && !isEditing ? (
                      <div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-3 whitespace-pre-wrap">
                          {report.report_content}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditingReport(camp.id, report.report_content)}
                            className="w-full sm:w-auto"
                          >
                            Edit Report
                          </Button>
                          <span className="text-xs sm:text-sm text-gray-500 self-center text-center sm:text-left">
                            Last updated: {new Date(report.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ) : isEditing ? (
                      <div className="space-y-3">
                        <Textarea
                          value={reportContent}
                          onChange={(e) => setReportContent(e.target.value)}
                          rows={8}
                          placeholder="Enter your comprehensive post-camp report here...

Include:
• Performance summary
• Technical skills assessment
• Areas of improvement demonstrated
• Strengths showcased
• Recommendations for future training"
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            variant="outline"
                            onClick={cancelEditing}
                            disabled={saving}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => report ? handleUpdateReport(report.id) : handleCreateReport(camp.id)}
                            disabled={saving || !reportContent.trim()}
                            className="w-full sm:w-auto"
                          >
                            {saving ? 'Saving...' : report ? 'Update Report' : 'Publish Report'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-3">No report created yet.</p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => startEditingReport(camp.id)}
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

