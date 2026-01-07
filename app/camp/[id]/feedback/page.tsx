'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Star, X, Upload, CheckCircle } from 'lucide-react';
import { Feedback } from '@/types';

// Star Rating Component
const StarRating = ({ 
  rating, 
  onRatingChange, 
  label, 
  required = false 
}: { 
  rating: number; 
  onRatingChange: (rating: number) => void; 
  label: string;
  required?: boolean;
}) => {
  const handleStarClick = (star: number) => {
    // If clicking the same rating that's already selected, clear it (set to 0)
    if (rating === star) {
      onRatingChange(0);
    } else {
      onRatingChange(star);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className={`transition-all duration-200 ${
              rating >= star
                ? 'text-yellow-400 scale-110'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={`w-8 h-8 sm:w-10 sm:h-10 ${
                rating >= star ? 'fill-current' : ''
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm sm:text-base text-gray-600">
            {rating} / 5
          </span>
        )}
      </div>
    </div>
  );
};

export default function FeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: campId } = use(params);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [camp, setCamp] = useState<any>(null);
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(null);
  const [user, setUser] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  // Form state - Accommodation
  const [accommodationRating, setAccommodationRating] = useState(0);
  const [accommodationText, setAccommodationText] = useState('');

  // Form state - Tennis
  const [tennisRating, setTennisRating] = useState(0);
  const [tennisText, setTennisText] = useState('');

  // Form state - Excursions
  const [excursionsRating, setExcursionsRating] = useState(0);
  const [excursionsText, setExcursionsText] = useState('');

  // Form state - Overall
  const [overallText, setOverallText] = useState('');

  // Form state - Photos & Consent
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [campId]);

  // Scroll to error message when error is set
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Also scroll window to top as fallback
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  const loadData = async () => {
    try {
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(userStr);
      setUser(userData);

      // Fetch camp details
      const campResponse = await fetch(`/api/camps/${campId}`);
      if (!campResponse.ok) {
        router.push('/home');
        return;
      }
      const campData = await campResponse.json();
      setCamp(campData);

      // Fetch existing feedback
      const feedbackResponse = await fetch(`/api/feedback?campId=${campId}&userId=${userData.id}`);

      if (feedbackResponse.ok) {
        const feedbackData = await feedbackResponse.json();
        if (feedbackData.feedback) {
          setExistingFeedback(feedbackData.feedback);
          const fb = feedbackData.feedback;
          // Populate form with existing feedback
          setAccommodationRating(fb.accommodation_rating || 0);
          setAccommodationText(fb.accommodation_text || '');
          setTennisRating(fb.tennis_rating || 0);
          setTennisText(fb.tennis_text || '');
          setExcursionsRating(fb.excursions_rating || 0);
          setExcursionsText(fb.excursions_text || '');
          setOverallText(fb.overall_text || fb.overall_trip_text || '');
          setPhotoUrls(fb.photo_urls || []);
          setConsentGiven(fb.consent_given || false);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (!files.length) return;
    
    // Clear any previous errors
    setError('');
    
    if (photoFiles.length + photoUrls.length + files.length > 5) {
      setError('Maximum 5 photos allowed');
      e.target.value = '';
      return;
    }

    let hasError = false;
    files.forEach((file) => {
      if (hasError) return; // Skip remaining files if error already occurred
      
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        hasError = true;
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        setError('Failed to read image file');
        hasError = true;
      };
      reader.onloadend = () => {
        if (reader.result && !hasError) {
          setPhotoPreviews((prev) => [...prev, reader.result as string]);
          setPhotoFiles((prev) => [...prev, file]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    // If no new photos selected, just return existing URLs
    if (photoFiles.length === 0) {
      return [...photoUrls];
    }

    const formData = new FormData();
    photoFiles.forEach((file) => {
      formData.append('photos', file);
    });
    formData.append('type', 'feedbacks');

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadResponse.json().catch(() => null);

    if (!uploadResponse.ok || !uploadData) {
      const message = uploadData?.error || 'Failed to upload photos';
      throw new Error(message);
    }

    const newUrls: string[] =
      uploadData.urls ||
      (uploadData.url ? [uploadData.url] : []);

    return [...photoUrls, ...newUrls];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (tennisRating === 0) {
      setError('Please rate your tennis experience');
      return;
    }

    if (!overallText.trim()) {
      setError('Please provide overall feedback about your experience with Ace Away and Franklin');
      return;
    }

    if (!consentGiven) {
      setError('Please consent to the use of your feedback');
      return;
    }

    setSubmitting(true);

    try {
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }

      // Upload new photos
      const allPhotoUrls = await uploadPhotos();

      const userData = JSON.parse(userStr);
      
      const payload = {
        campId,
        playerId: userData.id,
        accommodationRating: accommodationRating || null,
        accommodationText: accommodationText.trim() || null,
        tennisRating,
        tennisText: tennisText.trim() || null,
        excursionsRating: excursionsRating || null,
        excursionsText: excursionsText.trim() || null,
        overallText: overallText.trim(),
        photoUrls: allPhotoUrls,
        consentGiven,
      };

      let response;
      if (existingFeedback) {
        // Update existing feedback
        response = await fetch(`/api/feedback/${existingFeedback.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new feedback
        response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (response.ok) {
        // On success, redirect back to tennis program with a success message
        const status = existingFeedback ? 'updated' : 'created';
        router.push(`/camp/${campId}/tennis?feedback=${status}`);
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
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

  if (!camp) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <Alert variant="danger">Camp not found.</Alert>
        </div>
      </AppLayout>
    );
  }

  const hasAccommodation = camp.package !== 'tennis_only';

  return (
    <AppLayout>
          <div className="container mx-auto px-4 pt-8 pb-8 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">
            {existingFeedback ? 'Edit Your Feedback' : 'Share Your Feedback'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Help us improve by sharing your experience at this tennis camp.
          </p>
        </div>

        {submitting && !error && (
          <Alert variant="info" className="mb-4">
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Submitting your feedback and uploading photos. This may take a few seconds, please wait...</span>
            </div>
          </Alert>
        )}

        {error && (
          <div ref={errorRef}>
            <Alert variant="danger" className="mb-6">
              {error}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Accommodation Section */}
          {hasAccommodation && (
            <Card>
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl mb-4">
                  Accommodation
                </CardTitle>
                <StarRating
                  rating={accommodationRating}
                  onRatingChange={setAccommodationRating}
                  label="How would you rate your accommodation experience?"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your accommodation experience
                  </label>
                  <Textarea
                    value={accommodationText}
                    onChange={(e) => setAccommodationText(e.target.value)}
                    rows={3}
                    placeholder="Share your thoughts about the accommodation..."
                    className="w-full"
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* Tennis Section */}
          <Card>
            <CardBody className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl mb-4">
                Tennis
              </CardTitle>
              <StarRating
                rating={tennisRating}
                onRatingChange={setTennisRating}
                label="How would you rate your tennis experience and coaching with Coach Patrick?"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about your tennis experience
                </label>
                <Textarea
                  value={tennisText}
                  onChange={(e) => setTennisText(e.target.value)}
                  rows={3}
                  placeholder="Share your thoughts about the tennis sessions, coaching, and your progress..."
                  className="w-full"
                />
              </div>
            </CardBody>
          </Card>

          {/* Excursions Section */}
          <Card>
            <CardBody className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl mb-4">
                Excursions
              </CardTitle>
              <StarRating
                rating={excursionsRating}
                onRatingChange={setExcursionsRating}
                label="How would you rate the excursions, if any were organized?"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about the excursions
                </label>
                <Textarea
                  value={excursionsText}
                  onChange={(e) => setExcursionsText(e.target.value)}
                  rows={3}
                  placeholder="Share your thoughts about any excursions or activities..."
                  className="w-full"
                />
              </div>
            </CardBody>
          </Card>

          {/* Overall Feedback Section */}
          <Card>
            <CardBody className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl mb-4">
                Overall Feedback
              </CardTitle>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall experience with Ace Away and Franklin <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={overallText}
                  onChange={(e) => setOverallText(e.target.value)}
                  rows={4}
                  placeholder="Share your overall experience with Ace Away and Franklin..."
                  className="w-full"
                  required
                />
              </div>
            </CardBody>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardBody className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl mb-4">
                Photos (Optional)
              </CardTitle>
              <p className="text-sm text-gray-600 mb-4">
                Upload up to 5 photos from your camp experience, ideally including moments on court or with Coach Patrick.
              </p>

              {/* Photo Previews */}
              {(photoPreviews.length > 0 || photoUrls.length > 0) && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {photoPreviews.map((preview, index) => (
                      <div key={`preview-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 sm:h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md"
                          aria-label="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {photoUrls.map((url, index) => (
                      <div key={`url-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 sm:h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photoPreviews.length + index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md"
                          aria-label="Remove photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {photoPreviews.length + photoUrls.length < 5 && (
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </CardBody>
          </Card>

          {/* Consent */}
          <Card>
            <CardBody className="p-4 sm:p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <span className="text-sm sm:text-base text-gray-700">
                  I consent to the use of this feedback and photos on the website to help improve future tennis camps. <span className="text-red-500">*</span>
                </span>
              </label>
            </CardBody>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              fullWidth={false}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {existingFeedback ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                existingFeedback ? 'Update Feedback' : 'Submit Feedback'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
