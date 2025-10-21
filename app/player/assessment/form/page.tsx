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
    monthlyFrequency: '',
    competitionExperience: '',
    competitionLevel: '',
    
    // Game Profile
    confidentAspects: '',
    improvementAreas: '',
    
    // Physical & Health
    currentInjuries: '',
    discomfortMovements: '',
    fitnessRating: '',
    
    // Learning & Motivation (checkboxes)
    motivations: [] as string[],
    learningPreferences: [] as string[],
    
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
      // Validate checkboxes
      if (formData.motivations.length === 0) {
        setMessage('Please select at least one motivation.');
        setIsSubmitting(false);
        return;
      }
      if (formData.learningPreferences.length === 0) {
        setMessage('Please select at least one learning preference.');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Assessment submitted successfully! Thank you for your feedback.');
      // Reset form
      setFormData({
        // Personal Information
        dateOfBirth: '',
        
        // Playing Background
        playingDuration: '',
        monthlyFrequency: '',
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
        motivations: [],
        learningPreferences: [],
        
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

  const handleCheckboxChange = (field: 'motivations' | 'learningPreferences', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
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
                        How many years of tennis experience do you have in total? *
                      </label>
                      <select
                        name="playingDuration"
                        value={formData.playingDuration}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select total years</option>
                        <option value="less-than-1">Less than 1 year</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="more-than-10">More than 10 years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How often do you currently play per month? *
                      </label>
                      <select
                        name="monthlyFrequency"
                        value={formData.monthlyFrequency}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select frequency</option>
                        <option value="1-2">1-2 times per month</option>
                        <option value="3-4">3-4 times per month</option>
                        <option value="5+">5+ times per month</option>
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
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What motivates you most about tennis? * <span className="text-gray-500 text-xs">(Select all that apply)</span>
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'competition', label: 'Competition' },
                          { value: 'fitness', label: 'Fitness' },
                          { value: 'enjoyment', label: 'Enjoyment' },
                          { value: 'improvement', label: 'Improvement' },
                          { value: 'social', label: 'Social aspect' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.motivations.includes(option.value)}
                              onChange={() => handleCheckboxChange('motivations', option.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Do you prefer learning through: * <span className="text-gray-500 text-xs">(Select all that apply)</span>
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'technical', label: 'Technical detail' },
                          { value: 'video', label: 'Video feedback' },
                          { value: 'matches', label: 'Playing matches' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.learningPreferences.includes(option.value)}
                              onChange={() => handleCheckboxChange('learningPreferences', option.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goals & Expectations */}
                <div className="pb-2">
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