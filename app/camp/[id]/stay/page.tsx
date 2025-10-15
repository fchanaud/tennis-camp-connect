import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/utils/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function StayPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const campId = params.id;

  // Get camp details
  const { data: camp } = await supabase
    .from('camps')
    .select('*')
    .eq('id', campId)
    .single();

  if (!camp) redirect('/home');

  // Check if camp includes accommodation
  const hasAccommodation = 
    camp.package === 'stay_and_play' || 
    camp.package === 'luxury_stay_and_play' || 
    camp.package === 'no_tennis';

  if (!hasAccommodation) {
    redirect(`/camp/${campId}/tennis`);
  }

  const accommodationDetails = camp.accommodation_details || '';

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar user={user} camps={[camp]} />
      
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Camp / </span>
          <span className="font-semibold">Stay</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Your Accommodation</h1>

        {accommodationDetails ? (
          <div className="max-w-4xl">
            <Card hover premium>
              <CardBody className="p-6">
                <CardTitle className="text-2xl mb-6">Hotel Details</CardTitle>
                
                <div className="space-y-6">
                  {/* Accommodation Details Display */}
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {accommodationDetails}
                    </div>
                  </div>

                  {/* Embedded Map */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#FF4C4C]" />
                      Location
                    </h3>
                    <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6748934058!2d-7.9898!3d31.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDM3JzQ2LjIiTiA3wrA1OSczNS4zIlc!5e0!3m2!1sen!2s!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Common Amenities List (visual enhancement) */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Common Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['WiFi', 'Pool', 'Restaurant', 'Gym', 'Spa', 'Air Conditioning', 'Room Service', 'Parking'].map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-[#66B032] rounded-full" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Information */}
                  <Alert variant="info">
                    <strong>Important:</strong> Please verify check-in/check-out times and any specific hotel policies directly with the accommodation.
                  </Alert>
                </div>
              </CardBody>
            </Card>
          </div>
        ) : (
          <Alert variant="warning">
            Accommodation details have not been added yet. Please contact your administrator for information.
          </Alert>
        )}
      </div>
    </div>
  );
}

