import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/utils/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Collapsible } from '@/components/ui/Collapsible';
import { createClient } from '@/lib/supabase/server';

export default async function EssentialsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const supabase = await createClient();
  const { id: campId } = await params;

  // Get camp details
  const { data: camp } = await supabase
    .from('camps')
    .select('*')
    .eq('id', campId)
    .single();

  if (!camp) redirect('/home');

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar user={user} camps={[camp]} />
      
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Camp / </span>
          <span className="font-semibold">Essentials</span>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Travel Essentials</h1>
        <p className="text-gray-600 mb-8">Everything you need to know for your stay in Marrakech, Morocco</p>

        <div className="max-w-4xl space-y-3">
          {/* Water & Safety */}
          <Collapsible title="💧 Water & Safety">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Drinking Water</h4>
                <p className="text-gray-700">
                  • Always drink bottled water - available everywhere<br />
                  • Avoid tap water and ice cubes in drinks<br />
                  • Recommended brands: Sidi Ali, Sidi Harazem, Ain Saiss<br />
                  • Cost: 5-10 MAD (€0.50-€1) per 1.5L bottle
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hydration for Tennis</h4>
                <p className="text-gray-700">
                  • Bring 2-3 liters of water to training sessions<br />
                  • Marrakech can be very hot - stay hydrated!<br />
                  • Electrolyte drinks recommended for intensive training
                </p>
              </div>
            </div>
          </Collapsible>

          {/* eSIM & Data */}
          <Collapsible title="📱 eSIM & Mobile Data">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Recommended eSIM Providers</h4>
                <p className="text-gray-700">
                  • <strong>Airalo:</strong> Popular, easy setup, good Morocco coverage<br />
                  • <strong>Holafly:</strong> Unlimited data plans available<br />
                  • <strong>Nomad:</strong> Competitive pricing, reliable<br />
                  • Average cost: €15-30 for 7-14 days
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Setup Instructions</h4>
                <p className="text-gray-700">
                  1. Purchase eSIM before departure<br />
                  2. Install eSIM profile on your phone<br />
                  3. Activate upon arrival in Morocco<br />
                  4. Keep your home SIM for receiving calls/texts
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Local SIM Alternative</h4>
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
                  • ATMs widely available (Attijariwafa Bank, BMCE, Banque Populaire)<br />
                  • Airport ATMs available but often busy<br />
                  • Daily withdrawal limits typically 2,000-5,000 MAD<br />
                  • Keep some cash for taxis, souks, and small vendors
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tipping Customs</h4>
                <p className="text-gray-700">
                  • Restaurants: 10% if service not included<br />
                  • Taxis: Round up to nearest 5-10 MAD<br />
                  • Hotel staff: 10-20 MAD per service<br />
                  • Tour guides: 50-100 MAD per day
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Methods</h4>
                <p className="text-gray-700">
                  • Credit cards accepted in hotels, larger restaurants<br />
                  • Cash preferred in medina and local shops<br />
                  • Notify your bank of travel to Morocco
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Transport */}
          <Collapsible title="🚕 Transport Tips">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">From Airport</h4>
                <p className="text-gray-700">
                  • Official airport taxis: ~100-150 MAD to city center<br />
                  • Pre-book transfers through your hotel<br />
                  • Uber/Careem available but may be restricted at airport<br />
                  • Journey time: 15-20 minutes to city center
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Taxi Apps</h4>
                <p className="text-gray-700">
                  • <strong>Careem:</strong> Most reliable, widely used<br />
                  • <strong>InDrive:</strong> Negotiate price with drivers<br />
                  • <strong>Heetch:</strong> Growing availability<br />
                  • Regular petit taxis (red): use meter or agree price first
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">To Tennis Courts</h4>
                <p className="text-gray-700">
                  • Address: JXQC+JMQ, Marrakech<br />
                  • Typical taxi cost from city center: 30-50 MAD<br />
                  • Ask your hotel concierge for directions<br />
                  • Allow 15-20 minutes travel time
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Emergency Contacts */}
          <Collapsible title="🆘 Emergency Contacts">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Emergency Numbers</h4>
                <p className="text-gray-700">
                  • Police: 19<br />
                  • Ambulance: 15<br />
                  • Fire: 15<br />
                  • Tourist Police (Marrakech): +212 524-38-46-01
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Medical Services</h4>
                <p className="text-gray-700">
                  • Polyclinique du Sud: +212 524-44-79-99 (24/7, English spoken)<br />
                  • Hôpital Ibn Tofail: +212 524-44-88-88<br />
                  • Pharmacies open late (Pharmacie de Garde) rotate daily<br />
                  • Travel insurance strongly recommended
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Embassy Contacts (in Rabat)</h4>
                <p className="text-gray-700">
                  • US Embassy: +212 537-63-73-33<br />
                  • UK Embassy: +212 537-63-33-33<br />
                  • Canadian Embassy: +212 537-54-49-49<br />
                  • French Embassy: +212 537-68-97-00
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Camp Coordinator</h4>
                <p className="text-gray-700">
                  For any camp-related emergencies or questions, contact your assigned coach or camp administrator through the app.
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Additional Tips */}
          <Collapsible title="✨ Additional Tips">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Weather & Clothing</h4>
                <p className="text-gray-700">
                  • Pack light, breathable tennis wear<br />
                  • Sunscreen (SPF 50+) essential<br />
                  • Hat and sunglasses for outdoor sessions<br />
                  • Evenings can be cool - bring light jacket<br />
                  • Modest clothing recommended for medina visits
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Language</h4>
                <p className="text-gray-700">
                  • Arabic and French widely spoken<br />
                  • English common in tourist areas<br />
                  • Useful phrases: "Shukran" (thank you), "Salam" (hello)<br />
                  • Translation apps helpful
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Cultural Notes</h4>
                <p className="text-gray-700">
                  • Morocco is a Muslim country - respect local customs<br />
                  • Haggling expected in souks (start at 50% of asking price)<br />
                  • Remove shoes when entering homes/some restaurants<br />
                  • Right hand used for eating and greeting
                </p>
              </div>
            </div>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

