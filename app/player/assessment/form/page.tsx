'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function AssessmentForm() {
  const [formData, setFormData] = useState({
    overallRating: '',
    forehandTechnique: '',
    backhandTechnique: '',
    serveTechnique: '',
    volleyTechnique: '',
    footwork: '',
    comments: '',
    experienceLevel: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Assessment submitted successfully! Thank you for your feedback.');
      // Reset form
      setFormData({
        overallRating: '',
        forehandTechnique: '',
        backhandTechnique: '',
        serveTechnique: '',
        volleyTechnique: '',
        footwork: '',
        comments: '',
        experienceLevel: ''
      });
    } catch (error) {
      setMessage('Error submitting assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Technical Assessment</h1>
          
          {message && (
            <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-6">
              {message}
            </Alert>
          )}

          <Card>
            <CardBody className="p-6">
              <CardTitle className="text-xl mb-4">Please complete your technical assessment</CardTitle>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Tennis Skill Level *
                  </label>
                  <select
                    name="overallRating"
                    value={formData.overallRating}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select rating</option>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                {/* Forehand Technique */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forehand Technique *
                  </label>
                  <select
                    name="forehandTechnique"
                    value={formData.forehandTechnique}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select skill level</option>
                    <option value="5">5 - Advanced</option>
                    <option value="4">4 - Intermediate-Advanced</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="2">2 - Beginner-Intermediate</option>
                    <option value="1">1 - Beginner</option>
                  </select>
                </div>

                {/* Backhand Technique */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backhand Technique *
                  </label>
                  <select
                    name="backhandTechnique"
                    value={formData.backhandTechnique}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select skill level</option>
                    <option value="5">5 - Advanced</option>
                    <option value="4">4 - Intermediate-Advanced</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="2">2 - Beginner-Intermediate</option>
                    <option value="1">1 - Beginner</option>
                  </select>
                </div>

                {/* Serve Technique */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serve Technique *
                  </label>
                  <select
                    name="serveTechnique"
                    value={formData.serveTechnique}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select skill level</option>
                    <option value="5">5 - Advanced</option>
                    <option value="4">4 - Intermediate-Advanced</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="2">2 - Beginner-Intermediate</option>
                    <option value="1">1 - Beginner</option>
                  </select>
                </div>

                {/* Volley Technique */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volley Technique *
                  </label>
                  <select
                    name="volleyTechnique"
                    value={formData.volleyTechnique}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select skill level</option>
                    <option value="5">5 - Advanced</option>
                    <option value="4">4 - Intermediate-Advanced</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="2">2 - Beginner-Intermediate</option>
                    <option value="1">1 - Beginner</option>
                  </select>
                </div>

                {/* Footwork */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footwork *
                  </label>
                  <select
                    name="footwork"
                    value={formData.footwork}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select skill level</option>
                    <option value="5">5 - Advanced</option>
                    <option value="4">4 - Intermediate-Advanced</option>
                    <option value="3">3 - Intermediate</option>
                    <option value="2">2 - Beginner-Intermediate</option>
                    <option value="1">1 - Beginner</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tennis Experience Level *
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                    <option value="competitive">Competitive Player</option>
                  </select>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share any additional comments about your tennis skills or areas for improvement..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Technical Assessment'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
