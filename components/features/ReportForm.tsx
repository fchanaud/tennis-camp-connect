'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

interface ReportFormProps {
  existingAnswer?: string;
  onSubmit: (answer: string) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export function ReportForm({ existingAnswer, onSubmit, onCancel, isEditing }: ReportFormProps) {
  const [answer, setAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingAnswer) {
      setAnswer(existingAnswer);
    }
  }, [existingAnswer]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(answer);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    return answer.trim().length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Please provide detailed and constructive feedback to help the player continue their tennis journey.
        </p>
      </div>

      <Card className="border-l-4 border-l-blue-500">
        <CardBody className="p-4 sm:p-6">
          <div className="mb-2">
            <label className="block font-semibold text-gray-900 text-sm sm:text-base mb-1">
              Post-Camp Feedback
            </label>
            <p className="text-xs sm:text-sm text-gray-500 mb-3">
              Share your overall assessment of the player's performance, progress, strengths, and recommendations for future development.
            </p>
          </div>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={10}
            placeholder="Write your comprehensive feedback about the player's camp experience, including performance summary, areas of improvement, strengths showcased, and recommendations for future training..."
            className="w-full"
          />
          <div className="mt-2 text-xs text-gray-500">
            {answer.length} characters
          </div>
        </CardBody>
      </Card>

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
          Please provide feedback before submitting
        </p>
      )}
    </div>
  );
}

