'use client';

import { useState } from 'react';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Collapsible } from '@/components/ui/Collapsible';
import { PreCampAssessment } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface AssessmentFormProps {
  campId: string;
  playerId: string;
  existingAssessment: PreCampAssessment | null;
}

export function AssessmentForm({ campId, playerId, existingAssessment }: AssessmentFormProps) {
  const [isEditing, setIsEditing] = useState(!existingAssessment);
  const [formData, setFormData] = useState({
    playing_experience: existingAssessment?.answers?.playing_experience || '',
    skill_level: existingAssessment?.answers?.skill_level || 'beginner',
    dominant_hand: existingAssessment?.answers?.dominant_hand || 'right',
    goals: existingAssessment?.answers?.goals || '',
    strengths: existingAssessment?.answers?.strengths || '',
    areas_to_improve: existingAssessment?.answers?.areas_to_improve || '',
    previous_injuries: existingAssessment?.answers?.previous_injuries || '',
    additional_notes: existingAssessment?.answers?.additional_notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const supabase = createClient();

      if (existingAssessment) {
        // Update existing assessment
        const { error } = await supabase
          .from('pre_camp_assessments')
          .update({
            answers: formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingAssessment.id);

        if (error) throw error;
      } else {
        // Create new assessment
        const { error } = await supabase
          .from('pre_camp_assessments')
          .insert({
            player_id: playerId,
            camp_id: campId,
            answers: formData,
          });

        if (error) throw error;
      }

      setSuccess('Assessment saved successfully!');
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to save assessment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Pre-Camp Assessment</CardTitle>
          {existingAssessment && !isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit technical assessment
            </Button>
          )}
        </div>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}

        {!existingAssessment && !isEditing ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Complete your pre-camp assessment to help your coach prepare for your training.</p>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Complete Assessment
            </Button>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Playing Experience (years)"
              type="text"
              value={formData.playing_experience}
              onChange={(e) => setFormData({ ...formData, playing_experience: e.target.value })}
              placeholder="e.g., 5 years"
              required
            />

            <Select
              label="Skill Level"
              value={formData.skill_level}
              onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
                { value: 'pro', label: 'Professional' },
              ]}
            />

            <div>
              <label className="form-label">Dominant Hand</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dominant_hand"
                    value="right"
                    checked={formData.dominant_hand === 'right'}
                    onChange={(e) => setFormData({ ...formData, dominant_hand: e.target.value })}
                  />
                  <span>Right</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dominant_hand"
                    value="left"
                    checked={formData.dominant_hand === 'left'}
                    onChange={(e) => setFormData({ ...formData, dominant_hand: e.target.value })}
                  />
                  <span>Left</span>
                </label>
              </div>
            </div>

            <Textarea
              label="Goals for Camp"
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows={3}
              placeholder="What do you hope to achieve during this camp?"
              required
            />

            <Textarea
              label="Strengths"
              value={formData.strengths}
              onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
              rows={3}
              placeholder="What are your strongest skills?"
            />

            <Textarea
              label="Areas to Improve"
              value={formData.areas_to_improve}
              onChange={(e) => setFormData({ ...formData, areas_to_improve: e.target.value })}
              rows={3}
              placeholder="What would you like to work on?"
            />

            <Textarea
              label="Previous Injuries"
              value={formData.previous_injuries}
              onChange={(e) => setFormData({ ...formData, previous_injuries: e.target.value })}
              rows={2}
              placeholder="Any injuries we should be aware of?"
            />

            <Textarea
              label="Additional Notes"
              value={formData.additional_notes}
              onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
              rows={3}
              placeholder="Anything else you'd like to share?"
            />

            <div className="flex gap-3">
              {existingAssessment && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" disabled={saving} fullWidth={!existingAssessment}>
                {saving ? 'Saving...' : existingAssessment ? 'Update Assessment' : 'Submit Assessment'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Playing Experience:</p>
              <p className="font-semibold">{formData.playing_experience}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Skill Level:</p>
              <p className="font-semibold capitalize">{formData.skill_level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dominant Hand:</p>
              <p className="font-semibold capitalize">{formData.dominant_hand}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Goals:</p>
              <p className="whitespace-pre-wrap">{formData.goals}</p>
            </div>
            {formData.strengths && (
              <div>
                <p className="text-sm text-gray-600">Strengths:</p>
                <p className="whitespace-pre-wrap">{formData.strengths}</p>
              </div>
            )}
            {formData.areas_to_improve && (
              <div>
                <p className="text-sm text-gray-600">Areas to Improve:</p>
                <p className="whitespace-pre-wrap">{formData.areas_to_improve}</p>
              </div>
            )}
            {formData.previous_injuries && (
              <div>
                <p className="text-sm text-gray-600">Previous Injuries:</p>
                <p className="whitespace-pre-wrap">{formData.previous_injuries}</p>
              </div>
            )}
            {formData.additional_notes && (
              <div>
                <p className="text-sm text-gray-600">Additional Notes:</p>
                <p className="whitespace-pre-wrap">{formData.additional_notes}</p>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

