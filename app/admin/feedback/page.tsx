'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Star, User, Calendar, Image as ImageIcon } from 'lucide-react';
import { Feedback } from '@/types';

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<(Feedback & { player?: any; camp?: any })[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.push('/home');
        return;
      }
      
      // Always load all feedbacks (no filters needed)
      const response = await fetch('/api/admin/feedback');

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
      } else {
        setError('Failed to load feedbacks');
      }
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">
            Player Feedback
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            View all feedback submitted by players
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Feedbacks List */}
        {feedbacks.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No player feedback has been submitted yet.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardBody className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-5 h-5 text-gray-500" />
                          <span className="font-semibold text-lg">
                            {feedback.player
                              ? `${feedback.player.first_name} ${feedback.player.last_name}`
                              : 'Unknown Player'}
                          </span>
                        </div>
                        {feedback.camp && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(feedback.camp.start_date)} -{' '}
                              {formatDate(feedback.camp.end_date)}
                            </span>
                            <Badge variant="primary" className="ml-2">
                              {feedback.camp.package?.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        Submitted: {formatDate(feedback.created_at)}
                        {feedback.updated_at !== feedback.created_at && (
                          <div>Updated: {formatDate(feedback.updated_at)}</div>
                        )}
                      </div>
                    </div>

                    {/* Accommodation */}
                    {(feedback.accommodation_rating || feedback.accommodation_text) && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Accommodation
                        </h3>
                        {feedback.accommodation_rating && renderStars(feedback.accommodation_rating)}
                        {feedback.accommodation_text && (
                          <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap mt-2">
                            {feedback.accommodation_text}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Tennis */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Tennis
                      </h3>
                      {renderStars(feedback.tennis_rating)}
                      {feedback.tennis_text && (
                        <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap mt-2">
                          {feedback.tennis_text}
                        </p>
                      )}
                    </div>

                    {/* Excursions */}
                    {(feedback.excursions_rating || feedback.excursions_text) && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Excursions
                        </h3>
                        {feedback.excursions_rating && renderStars(feedback.excursions_rating)}
                        {feedback.excursions_text && (
                          <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap mt-2">
                            {feedback.excursions_text}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Overall Feedback */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Overall Feedback (Ace Away & Franklin)
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">
                        {feedback.overall_text || feedback.overall_trip_text || 'No overall feedback provided'}
                      </p>
                    </div>

                    {/* Photos */}
                    {feedback.photo_urls && feedback.photo_urls.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-5 h-5" />
                          Photos ({feedback.photo_urls.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {feedback.photo_urls.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Feedback photo ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(url, '_blank')}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

