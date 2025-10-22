'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Collapsible } from '@/components/ui/Collapsible';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';

export default function EssentialsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: campId } = use(params);
  const [user, setUser] = useState<any>(null);
  const [camp, setCamp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error loading essentials page data:', error);
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
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!camp) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 pt-8 pb-8">
          <Alert variant="danger">Camp not found</Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Camp / </span>
          <span className="font-semibold">Essentials</span>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Travel essentials</h1>
        <p className="text-gray-600 mb-8">Everything you need to know for your stay in Marrakech, Morocco</p>

        <div className="max-w-4xl space-y-3">
          {/* Tennis Court Rental */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
            <p className="text-blue-800 text-sm sm:text-base">
              <span className="font-semibold">🎾 Court rental:</span> 23€/hour anytime during your stay. 
              Arrange with your coach, payment to Franklin at camp end.
            </p>
          </div>
          {/* Water & Safety */}
          <Collapsible title="💧 Water & safety">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Drinking water</h4>
                <p className="text-gray-700">
                  • Always drink bottled water - available everywhere<br />
                  • Avoid tap water and ice cubes in drinks<br />
                  • Cost: 5-10 MAD (€0.50-€1) per 1.5L bottle
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hydration for tennis</h4>
                <p className="text-gray-700">
                  • Marrakech can be very hot - stay hydrated!<br />
                  • Bring 2-3 liters of water to training sessions<br />
                  • Supermarket just next to the tennis court on the left
                </p>
              </div>
            </div>
          </Collapsible>

          {/* eSIM & Data */}
          <Collapsible title="📱 eSIM & mobile data">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Recommended eSIM providers</h4>
                <p className="text-gray-700">
                  • <strong>Revolut:</strong> Competitive pricing, reliable (best option)<br />
                  • <strong>Airalo:</strong> Popular, easy setup, good Morocco coverage<br />
                  • Average cost: 5-15€ for 5-10 days
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Setup instructions</h4>
                <p className="text-gray-700">
                  1. Purchase eSIM before departure<br />
                  2. Install eSIM profile on your phone<br />
                  3. Activate upon arrival in Morocco<br />
                  4. Keep your home SIM for receiving calls/texts
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Local SIM alternative</h4>
                <p className="text-gray-700">
                  • Providers: Maroc Telecom, Orange, Inwi<br />
                  • Available at airport and city shops<br />
                  • Passport required for purchase<br />
                  • Cost: ~100-200 MAD (€10-20) for tourist packages
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Money & ATMs */}
          <Collapsible title="💰 Money & ATMs">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Currency</h4>
                <p className="text-gray-700">
                  • Moroccan Dirham (MAD)<br />
                  • Approximate rate: 1 EUR = 10-11 MAD<br />
                  • Cannot be obtained outside Morocco
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">ATMs & Cash</h4>
                <p className="text-gray-700">
                  • ATMs widely available (ATM Al Barid @ Place Jemaa el fna in the medina highly recommended)<br />
                  • Airport ATMs available but often busy<br />
                  • Daily withdrawal limits typically 2,000-5,000 MAD<br />
                  • Keep some cash for taxis, accomodation, souks, and small vendors
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Transport */}
          <Collapsible title="🚕 Transport tips">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">From airport</h4>
                <p className="text-gray-700">
                  • Transfers included if you have a play & stay package<br />
                  • Otherwise, official airport taxis (straight on the right outside the airport - need to pay at the kiosk): ~100-150 MAD to city center<br />
                  • Journey time: 15-20 minutes to city center (depending on traffic)
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Taxi apps</h4>
                <p className="text-gray-700">
                  • Download <strong>InDrive</strong> to move around (cheaper than taxis and quite reliable - highly recommended)<br />
                  • Regular taxis: use meter or agree price first
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Emergency Contacts */}
          <Collapsible title="🆘 Emergency contacts">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Emergency numbers</h4>
                <p className="text-gray-700">
                  • Police: 19<br />
                  • Ambulance: 15<br />
                  • Fire: 15<br />
                  • Tourist Police (Marrakech): +212 524-38-46-01
                </p>
              </div>
                <div>
                  <h4 className="font-semibold mb-2">Camp coordinator</h4>
                  <p className="text-gray-700">
                    For any camp-related emergencies or questions, contact through WhatsApp:
                  </p>
                  <div className="mt-2 space-y-1">
                    <div>
                      • Franklin: <a 
                        href="https://wa.me/447762400410" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        +44 7 76 24 00 410
                      </a>
                    </div>
                    <div>
                      • Patrick (coach): <a 
                        href="https://wa.me/212653890162" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        +212 653 890 162
                      </a>
                    </div>
                  </div>
                </div>
            </div>
          </Collapsible>

          {/* Additional Tips */}
          <Collapsible title="✨ Additional tips">
            <div className="space-y-3"> 
              <div>
                <h4 className="font-semibold mb-2">Language</h4>
                <p className="text-gray-700">
                  • Arabic and French widely spoken<br />
                  • English common in tourist areas<br />
                  • Useful phrases: "Shukran" (thank you), "Salam" (hello)<br />
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cultural notes</h4>
                <p className="text-gray-700">
                  • Morocco is a Muslim country - respect local customs<br />
                  • Haggling expected in souks (start at 50% of asking price)<br />
                </p>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
    </AppLayout>
  );
}

