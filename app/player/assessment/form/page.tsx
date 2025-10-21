'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function AssessmentForm() {
  const [formData, setFormData] = useState({
    // Personal Information
    dateOfBirth: '',
    
    // Playing Background
    playingDuration: '',
    weeklyFrequency: '',
    competitionExperience: '',
    competitionLevel: '',
    
    // Game Profile
    confidentAspects: '',
    improvementAreas: '',
    
    // Physical & Health
    currentInjuries: '',
    discomfortMovements: '',
    fitnessRating: '',
    
    // Learning & Motivation
    motivation: '',
    learningPreference: '',
    
    // Goals & Expectations
    mainGoal: '',
    additionalInfo: ''
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
        // Personal Information
        dateOfBirth: '',
        
        // Playing Background
        playingDuration: '',
        weeklyFrequency: '',
        competitionExperience: '',
        competitionLevel: '',
        
        // Game Profile
        confidentAspects: '',
        improvementAreas: '',
        
        // Physical & Health
        currentInjuries: '',
        discomfortMovements: '',
        fitnessRating: '',
        
        // Learning & Motivation
        motivation: '',
        learningPreference: '',
        
        // Goals & Expectations
        mainGoal: '',
        additionalInfo: ''
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Technical Assessment</h1>
          
          {message && (
            <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-6">
              {message}
            </Alert>
          )}

          <Card>
            <CardBody className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="border-b pb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Playing Background */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Playing Background</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How long have you been playing tennis? *
                      </label>
                      <select
                        name="playingDuration"
                        value={formData.playingDuration}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select duration</option>
                        <option value="less-than-1">Less than 1 year</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="more-than-10">More than 10 years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How often do you currently play per week? *
                      </label>
                      <select
                        name="weeklyFrequency"
                        value={formData.weeklyFrequency}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select frequency</option>
                        <option value="1">1 time per week</option>
                        <option value="2">2 times per week</option>
                        <option value="3">3 times per week</option>
                        <option value="4">4 times per week</option>
                        <option value="5">5+ times per week</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Have you played in competitions or tournaments? *
                      </label>
                      <select
                        name="competitionExperience"
                        value={formData.competitionExperience}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select answer</option>
                        <option value="no">No, never</option>
                        <option value="local">Yes, local competitions</option>
                        <option value="regional">Yes, regional tournaments</option>
                        <option value="national">Yes, national tournaments</option>
                        <option value="international">Yes, international tournaments</option>
                      </select>
                    </div>
                    
                    {formData.competitionExperience !== 'no' && formData.competitionExperience !== '' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          At what level? *
                        </label>
                        <select
                          name="competitionLevel"
                          value={formData.competitionLevel}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select level</option>
                          <option value="beginner">Beginner level</option>
                          <option value="intermediate">Intermediate level</option>
                          <option value="advanced">Advanced level</option>
                          <option value="professional">Professional level</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Profile */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Which parts of your game do you feel most confident about? *
                      </label>
                      <textarea
                        name="confidentAspects"
                        value={formData.confidentAspects}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., forehand, serve, volleys, footwork..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Which aspects of your game would you most like to improve during this camp? *
                      </label>
                      <textarea
                        name="improvementAreas"
                        value={formData.improvementAreas}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., backhand consistency, serve power, mental game..."
                      />
                    </div>
                  </div>
                </div>

                {/* Physical & Health */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical & Health</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Do you currently have or have you recently had any injuries or physical issues? *
                      </label>
                      <textarea
                        name="currentInjuries"
                        value={formData.currentInjuries}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Please describe any current or recent injuries, or write 'None' if applicable..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Are there any movements or exercises that cause you discomfort? *
                      </label>
                      <textarea
                        name="discomfortMovements"
                        value={formData.discomfortMovements}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Please describe any movements that cause discomfort, or write 'None' if applicable..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How would you rate your overall fitness for tennis? *
                      </label>
                      <select
                        name="fitnessRating"
                        value={formData.fitnessRating}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select rating</option>
                        <option value="1">1 - Very low</option>
                        <option value="2">2 - Low</option>
                        <option value="3">3 - Average</option>
                        <option value="4">4 - Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Learning & Motivation */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning & Motivation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What motivates you most about tennis? *
                      </label>
                      <select
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select motivation</option>
                        <option value="competition">Competition</option>
                        <option value="fitness">Fitness</option>
                        <option value="enjoyment">Enjoyment</option>
                        <option value="improvement">Improvement</option>
                        <option value="social">Social aspect</option>
                        <option value="multiple">Multiple reasons</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Do you prefer learning through technical detail, video feedback, or playing matches? *
                      </label>
                      <select
                        name="learningPreference"
                        value={formData.learningPreference}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select preference</option>
                        <option value="technical">Technical detail</option>
                        <option value="video">Video feedback</option>
                        <option value="matches">Playing matches</option>
                        <option value="combination">Combination of methods</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Goals & Expectations */}
                <div className="2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals & Expectations</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What's your main goal for this camp — the #1 thing you want to walk away with? *
                      </label>
                      <textarea
                        name="mainGoal"
                        value={formData.mainGoal}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your primary goal for this camp..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is there anything important about your tennis or expectations we haven't covered that you'd like the coach to know?
                      </label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>
                  </div>
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