'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface AssessmentData {
  id: string;
  playerId: string;
  campId: string;
  completedAt: string;
  overallRating: number;
  tennisQuality: number;
  accommodationQuality: number;
  staffFriendliness: number;
  valueForMoney: number;
  comments: string;
  wouldRecommend: string;
}

export default function AssessmentView({ params }: { params: Promise<{ id: string }> }) {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading assessment data
    const loadAssessment = async () => {
      try {
        // In a real app, this would fetch from the API using the params.id
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setAssessment({
          id: 'assessment-123',
          playerId: 'player-456',
          campId: 'camp-789',
          completedAt: new Date().toISOString(),
          overallRating: 4.5,
          tennisQuality: 5,
          accommodationQuality: 4,
          staffFriendliness: 5,
          valueForMoney: 4,
          comments: 'Great camp experience! The tennis program was excellent and the staff was very friendly.',
          wouldRecommend: 'yes'
        });
      } catch (error) {
        console.error('Error loading assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, []);

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Very Good';
    if (rating >= 2.5) return 'Good';
    if (rating >= 1.5) return 'Fair';
    return 'Poor';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'info';
    if (rating >= 2.5) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <div className="text-center">Loading assessment...</div>
        </div>
      </AppLayout>
    );
  }

  if (!assessment) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Assessment Not Found</h1>
            <p className="text-gray-600 mb-4">The requested technical assessment could not be found.</p>
            <Link href="/home">
              <Button variant="primary">Return to Home</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Technical Assessment Results</h1>
            <Link href="/home">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardBody className="p-6">
              <CardTitle className="text-xl mb-4">Overall Rating</CardTitle>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-[#FF4C4C]">
                  {assessment.overallRating}
                </div>
                <Badge variant={getRatingColor(assessment.overallRating)}>
                  {getRatingLabel(assessment.overallRating)}
                </Badge>
              </div>
              <CardText className="text-gray-600">
                Completed on {new Date(assessment.completedAt).toLocaleDateString()}
              </CardText>
            </CardBody>
          </Card>

          <Card className="mb-6">
            <CardBody className="p-6">
              <CardTitle className="text-xl mb-4">Detailed Ratings</CardTitle>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Tennis Program Quality</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{assessment.tennisQuality}</span>
                    <Badge variant={getRatingColor(assessment.tennisQuality)}>
                      {getRatingLabel(assessment.tennisQuality)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Staff Friendliness</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{assessment.staffFriendliness}</span>
                    <Badge variant={getRatingColor(assessment.staffFriendliness)}>
                      {getRatingLabel(assessment.staffFriendliness)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Value for Money</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{assessment.valueForMoney}</span>
                    <Badge variant={getRatingColor(assessment.valueForMoney)}>
                      {getRatingLabel(assessment.valueForMoney)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="mb-6">
            <CardBody className="p-6">
              <CardTitle className="text-xl mb-4">Recommendation</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={assessment.wouldRecommend === 'yes' ? 'success' : assessment.wouldRecommend === 'maybe' ? 'warning' : 'danger'}>
                  {assessment.wouldRecommend === 'yes' ? 'Yes, definitely' : 
                   assessment.wouldRecommend === 'maybe' ? 'Maybe' : 'No'}
                </Badge>
              </div>
            </CardBody>
          </Card>

          {assessment.comments && (
            <Card>
              <CardBody className="p-6">
                <CardTitle className="text-xl mb-4">Comments</CardTitle>
                <CardText className="text-gray-700 whitespace-pre-wrap">
                  {assessment.comments}
                </CardText>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
