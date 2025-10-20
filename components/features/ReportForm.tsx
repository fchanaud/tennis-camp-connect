'use client';

import { useState, useEffect } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

interface ReportFormProps {
  existingAnswers?: Record<string, string>;
  onSubmit: (answers: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export function ReportForm({ existingAnswers, onSubmit, onCancel, isEditing }: ReportFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({
    performance_summary: '',
    technical_skills: '',
    areas_improved: '',
    strengths_showcased: '',
    recommendations: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingAnswers) {
      setAnswers(existingAnswers);
    }
  }, [existingAnswers]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(answers);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    return Object.values(answers).every(answer => answer.trim().length > 0);
  };

  const questions = [
    {
      id: 'performance_summary',
      label: '1. Performance Summary',
      placeholder: 'Provide an overall summary of the player\'s performance during the camp...',
      helperText: 'Include general observations, effort level, and overall progress',
      rows: 4,
    },
    {
      id: 'technical_skills',
      label: '2. Technical Skills Assessment',
      placeholder: 'Assess the player\'s technical abilities (serve, forehand, backhand, volley, etc.)...',
      helperText: 'Detail specific stroke mechanics, consistency, and technique improvements',
      rows: 4,
    },
    {
      id: 'areas_improved',
      label: '3. Areas Improved During Camp',
      placeholder: 'List and describe the areas where the player showed improvement...',
      helperText: 'Be specific about skills, behaviors, or understanding that developed',
      rows: 4,
    },
    {
      id: 'strengths_showcased',
      label: '4. Strengths Showcased',
      placeholder: 'Highlight the player\'s key strengths and natural abilities...',
      helperText: 'Include both technical and mental/tactical strengths',
      rows: 4,
    },
    {
      id: 'recommendations',
      label: '5. Recommendations for Future Training',
      placeholder: 'Provide specific recommendations for the player\'s continued development...',
      helperText: 'Suggest drills, focus areas, and training priorities',
      rows: 4,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> All questions are required. Please provide detailed and constructive feedback to help the player continue their tennis journey.
        </p>
      </div>

      {questions.map((question, index) => (
        <Card key={question.id} className="border-l-4 border-l-blue-500">
          <CardBody className="p-4 sm:p-6">
            <div className="mb-2">
              <label className="block font-semibold text-gray-900 text-sm sm:text-base mb-1">
                {question.label}
              </label>
              {question.helperText && (
                <p className="text-xs sm:text-sm text-gray-500 mb-3">{question.helperText}</p>
              )}
            </div>
            <Textarea
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              rows={question.rows}
              placeholder={question.placeholder}
              className="w-full"
            />
            <div className="mt-2 text-xs text-gray-500">
              {answers[question.id]?.length || 0} characters
            </div>
          </CardBody>
        </Card>
      ))}

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-white border-t pt-4 mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={submitting || !isFormValid()}
          className="w-full sm:flex-1 sm:w-auto order-1 sm:order-2"
        >
          {submitting ? 'Saving...' : isEditing ? 'Update Report' : 'Publish Report'}
        </Button>
      </div>

      {!isFormValid() && (
        <p className="text-sm text-amber-600 text-center">
          Please complete all questions before submitting
        </p>
      )}
    </div>
  );
}

