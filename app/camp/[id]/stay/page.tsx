'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { MapPin, Phone, Mail, Clock, Wifi, Car, Utensils, Dumbbell, Waves } from 'lucide-react';

export default function StayPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: campId } = use(params);
  const [loading, setLoading] = useState(true);
  const [camp, setCamp] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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

        // Check if camp includes accommodation
        const hasAccommodation = 
          campData.package === 'stay_and_play' || 
          campData.package === 'luxury_stay_and_play' || 
          campData.package === 'no_tennis';

        if (!hasAccommodation) {
          router.push(`/camp/${campId}/tennis`);
          return;
        }
      } catch (error) {
        console.error('Error loading accommodation data:', error);
        router.push('/home');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [campId, router]);

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

  if (!camp || !user) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <Alert variant="danger">
            Camp not found. Please check your camp details.
          </Alert>
        </div>
      </AppLayout>
    );
  }

  const accommodationDetails = camp.accommodation_details || '';

  // Function to detect and extract Google Maps links
  const extractGoogleMapsLinks = (text: string) => {
    const googleMapsRegex = /(https:\/\/www\.google\.com\/maps\/[^\s]+)/g;
    const matches = text.match(googleMapsRegex);
    return matches || [];
  };

  // Function to render text with Google Maps embeds
  const renderTextWithMaps = (text: string) => {
    const googleMapsLinks = extractGoogleMapsLinks(text);
    let processedText = text;

    // Replace Google Maps links with placeholders
    googleMapsLinks.forEach((link, index) => {
      processedText = processedText.replace(link, `__MAP_PLACEHOLDER_${index}__`);
    });

    // Split by line breaks and process each line
    const lines = processedText.split('\n');
    const elements: React.ReactElement[] = [];

    lines.forEach((line, lineIndex) => {
      if (line.trim()) {
        // Non-empty line - render as paragraph
        elements.push(
          <p key={lineIndex} className="mb-3 text-sm sm:text-base text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      } else {
        // Empty line - render as spacing div to preserve original formatting
        elements.push(
          <div key={`spacing-${lineIndex}`} className="h-3"></div>
        );
      }
    });

    // Add Google Maps embeds after the text
    googleMapsLinks.forEach((link, index) => {
      elements.push(
        <div key={`map-${index}`} className="mt-4">
          <div 
            className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden relative"
            style={{ touchAction: 'pan-y pinch-zoom' }}
          >
            <iframe
              src={`https://www.google.com/maps/embed?pb=${link.split('pb=')[1]?.split('&')[0] || ''}&gestureHandling=greedy`}
              width="100%"
              height="100%"
              style={{ border: 0, pointerEvents: 'auto' }}
              allowFullScreen
              loading="lazy"
              title={`Accommodation Location ${index + 1}`}
            />
          </div>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              📍 View on Google Maps
              <span className="text-xs">(Tap to open)</span>
            </a>
          </p>
        </div>
      );
    });

    return elements;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 pt-8 pb-8">

        {(accommodationDetails || camp.accommodation_name) ? (
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            {/* Accommodation Header Card */}
            {camp.accommodation_name && (
              <Card>
                <CardBody className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Photo */}
                    {camp.accommodation_photo_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={camp.accommodation_photo_url}
                          alt={camp.accommodation_name}
                          className="w-full sm:w-48 h-32 sm:h-40 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">
                        {camp.accommodation_name}
                      </CardTitle>
                      
                      {camp.accommodation_phone && (
                        <div className="mb-2 sm:mb-3">
                          <span className="text-sm sm:text-base text-gray-600">📞 Phone: </span>
                          <a 
                            href={`tel:${camp.accommodation_phone}`}
                            className="text-blue-600 hover:underline cursor-pointer font-medium text-sm sm:text-base"
                          >
                            {camp.accommodation_phone}
                          </a>
                        </div>
                      )}
                      
                      {camp.accommodation_map_link && (
                        <div className="mb-3 sm:mb-4">
                          <a 
                            href={camp.accommodation_map_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:underline cursor-pointer text-sm sm:text-base"
                          >
                            📍 View on Google Maps
                            <span className="text-xs">(Tap to open)</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Accommodation Details Card */}
            {accommodationDetails && (
              <Card>
                <CardBody className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6">Accommodation Details</CardTitle>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {renderTextWithMaps(accommodationDetails)}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Amenities Card */}
            <Card>
              <CardBody className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 md:mb-6">Amenities & Services</CardTitle>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Standard Amenities</h4>
                    {[
                      { icon: Wifi, name: 'Free WiFi', description: 'High-speed internet access' },
                      { icon: Utensils, name: 'Restaurant', description: 'On-site full meal for 20€ per person' },
                      { icon: Waves, name: 'Swimming Pool', description: 'Outdoor pool area' },
                    ].map((amenity) => (
                      <div key={amenity.name} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <amenity.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#66B032] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-800 text-sm sm:text-base">{amenity.name}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{amenity.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Additional Services</h4>
                    {[
                      'Air conditioning',
                      'Daily housekeeping',
                      'Concierge Service',
                      'Laundry Service'
                    ].map((service) => (
                      <div key={service} className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#66B032] rounded-full flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Important Information Card */}
            <Card>
              <CardBody className="p-4 sm:p-6">
                <Alert variant="info">
                  <div className="space-y-2">
                    <div className="font-semibold text-sm sm:text-base">Important Information:</div>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                      <li>Please verify check-in/check-out times directly with the accommodation</li>
                      <li>Contact the hotel for any special requests or dietary requirements</li>
                      <li>Check for any specific hotel policies or restrictions</li>
                    </ul>
                  </div>
                </Alert>
              </CardBody>
            </Card>
          </div>
        ) : (
          <Card>
            <CardBody className="p-4 sm:p-6">
              <Alert variant="warning">
                <div className="text-center py-6 sm:py-8">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏨</div>
                  <div className="font-semibold text-base sm:text-lg mb-2">Accommodation Details Coming Soon</div>
                  <div className="text-gray-600 text-sm sm:text-base">
                    Detailed accommodation information will be available soon. 
                    Please contact your administrator for more information about your stay.
                  </div>
                </div>
              </Alert>
            </CardBody>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

