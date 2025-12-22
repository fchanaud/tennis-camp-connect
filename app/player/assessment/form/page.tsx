'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Download } from 'lucide-react';
import { generateAssessmentPDF } from '@/lib/utils/pdfGenerator';

export default function AssessmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [existingAssessment, setExistingAssessment] = useState<any>(null);
  const [camp, setCamp] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
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
  const [errors, setErrors] = useState({
    motivations: '',
    learningPreferences: ''
  });

  // Load existing assessment on mount
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const userStr = sessionStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
          return;
        }
        
        const userData = JSON.parse(userStr);
        setUser(userData);
        const response = await fetch(`/api/player/assessment?userId=${userData.id}`);
        const data = await response.json();
        
        if (data.hasAssessment && data.assessment) {
          // Populate form with existing data from answers JSONB field
          setExistingAssessment(data.assessment);
          const answers = data.assessment.answers || {};
          setFormData({
            dateOfBirth: answers.date_of_birth || '',
            playingDuration: answers.playing_duration || '',
            monthlyFrequency: answers.monthly_frequency || '',
            competitionExperience: answers.competition_experience || '',
            competitionLevel: answers.competition_level || '',
            confidentAspects: answers.confident_aspects || '',
            improvementAreas: answers.improvement_areas || '',
            currentInjuries: answers.current_injuries || '',
            discomfortMovements: answers.discomfort_movements || '',
            fitnessRating: answers.fitness_rating || '',
            motivations: answers.motivations || [],
            learningPreferences: answers.learning_preferences || [],
            mainGoal: answers.main_goal || '',
            additionalInfo: answers.additional_info || ''
          });

          // Load camp information for PDF
          if (data.assessment.camp_id) {
            const campResponse = await fetch(`/api/camps/${data.assessment.camp_id}`);
            if (campResponse.ok) {
              const campData = await campResponse.json();
              setCamp(campData);
            }
          }
        }
      } catch (error) {
        console.error('Error loading assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors and messages
    setErrors({
      motivations: '',
      learningPreferences: ''
    });
    setMessage('');
    
    // Validate checkboxes
    let hasErrors = false;
    const newErrors = {
      motivations: '',
      learningPreferences: ''
    };
    
    if (formData.motivations.length === 0) {
      newErrors.motivations = 'Please select at least one motivation';
      hasErrors = true;
    }
    
    if (formData.learningPreferences.length === 0) {
      newErrors.learningPreferences = 'Please select at least one learning preference';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      setMessage('Please complete all required fields');
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userStr = sessionStorage.getItem('user');
      if (!userStr) {
        router.push('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      
      // Submit assessment to API
      const response = await fetch('/api/player/assessment', {
        method: existingAssessment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          assessmentData: {
            date_of_birth: formData.dateOfBirth,
            playing_duration: formData.playingDuration,
            monthly_frequency: formData.monthlyFrequency,
            competition_experience: formData.competitionExperience,
            competition_level: formData.competitionLevel,
            confident_aspects: formData.confidentAspects,
            improvement_areas: formData.improvementAreas,
            current_injuries: formData.currentInjuries,
            discomfort_movements: formData.discomfortMovements,
            fitness_rating: formData.fitnessRating,
            motivations: formData.motivations,
            learning_preferences: formData.learningPreferences,
            main_goal: formData.mainGoal,
            additional_info: formData.additionalInfo
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }
      
      // Redirect to home page after successful submission
      router.push('/home');
    } catch (error) {
      setMessage('Error submitting assessment. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // Clear error for this field when user makes a selection
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <div className="max-w-3xl mx-auto flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">
              {existingAssessment ? 'Edit Technical Assessment' : 'Technical Assessment'}
            </h1>
            {existingAssessment && camp && user && (
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await generateAssessmentPDF(
                      {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                      },
                      {
                        start_date: camp.start_date,
                        end_date: camp.end_date,
                        package: camp.package
                      },
                      existingAssessment
                    );
                  } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Failed to generate PDF. Please make sure jspdf is installed.');
                  }
                }}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download pre camp assessment
              </Button>
            )}
          </div>
          
          {message && (
            <Alert 
              variant={message.includes('Error') || message.includes('complete all required') ? 'danger' : 'success'} 
              className="mb-6 text-base md:text-lg font-semibold"
            >
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
                      <div className={`space-y-2 ${errors.motivations ? 'border-2 border-red-500 rounded-md p-3 bg-red-50' : ''}`}>
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
                      {errors.motivations && (
                        <p className="mt-2 text-sm md:text-base text-red-600 font-semibold">
                          ⚠️ {errors.motivations}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What helps you learn best? * <span className="text-gray-500 text-xs">(Select all that apply)</span>
                      </label>
                      <div className={`space-y-2 ${errors.learningPreferences ? 'border-2 border-red-500 rounded-md p-3 bg-red-50' : ''}`}>
                        {[
                          { value: 'drills', label: 'Drills and repetition' },
                          { value: 'explanation', label: 'Clear explanations and demonstrations' },
                          { value: 'video', label: 'Video analysis of my technique' },
                          { value: 'practice-matches', label: 'Practice matches and point play' }
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
                      {errors.learningPreferences && (
                        <p className="mt-2 text-sm md:text-base text-red-600 font-semibold">
                          ⚠️ {errors.learningPreferences}
                        </p>
                      )}
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
                    {isSubmitting 
                      ? (existingAssessment ? 'Updating...' : 'Submitting...') 
                      : (existingAssessment ? 'Update technical assessment' : 'Submit technical assessment')
                    }
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