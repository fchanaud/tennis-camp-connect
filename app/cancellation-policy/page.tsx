'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Collapsible } from '@/components/ui/Collapsible';

export default function CancellationPolicyPage() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  const content = {
    en: {
      title: 'Cancellation & refund policy / Tennis Camp',
      sections: [
        {
          title: '1. Payment & registration',
          content: [
            'The total camp base price is £600 per participant.',
            'A £250 deposit is required at the time of booking to reserve a place.',
            'The remaining balance of £350 is due 30 days before the camp start date.',
            '',
            'A participant is considered fully registered only once:',
            '1. The organiser confirms his registration back, and',
            '2. Flight details have been provided within 7 days of booking.',
            '',
            'Failure to submit flight details within 7 days will result in a reminder. if flight details are still not provided, the participant will be considered as no longer joining, and the deposit will be refunded.',
            '',
            'All payments are processed securely via Revolut or Stripe.',
          ],
        },
        {
          title: '2. Cancellation by participant',
          content: [
            'All cancellations must be submitted in writing by email to hello@aceawaytravel.com',
            '',
            'Refund policy (applies to all payments made up to the cancellation date):',
            '',
            '• More than 60 days before the start date: refund of all payments made minus £150 charge.',
            '• 30–60 days before the start date: 50% refund of the total camp price (£300).',
            '• Less than 30 days before the start date: no refund.',
            '• No-shows, late arrivals or early departures: no refunds or credits.',
            '',
            'Booking transfers are allowed if the replacement participant matches the camp requirements and is not a beginner. all other rules and deadlines still apply.',
            '',
            'Refunds cover all camp services paid for, excluding flights and personal travel arrangements.',
          ],
        },
        {
          title: '3. Flights & airport transfers',
          content: [
            'Participants are responsible for booking and paying for their own flights.',
            '',
            'One flight will be recommended for Wednesday arrival to coordinate group transfers. Arrival on Wednesday is mandatory. Dinner on Wednesday is not included; participants are responsible for this meal.',
            '',
            'Airport transfers for flights other than the recommended option cannot be guaranteed, and any additional transport costs are the participant\'s responsibility. no refunds are provided for missed or delayed transport.',
          ],
        },
        {
          title: '4. Coach unavailability / injury',
          content: [
            'In the unlikely event that a coach is unavailable due to injury or illness:',
            '',
            '• Tennis sessions will still take place on the clay courts',
            '• Participants will retain full access to courts and tennis activities',
            '• Any refund of the tennis coaching portion will be calculated based on the participant\'s paid coaching fee and processed immediately',
            '',
            'Refunds do not apply to accommodation, meals, excursions or other included services.',
          ],
        },
        {
          title: '5. Weather conditions',
          content: [
            'The camp programme includes approximately 9 hours of tennis per day, subject to weather conditions.',
            '',
            '• Tennis may proceed in light rain if courts are playable',
            '• Sessions may be adjusted, shortened, rescheduled or replaced with alternative tennis activities as necessary.',
            '',
            'Weather-related interruptions do not entitle participants to refunds, provided a reasonable overall programme is delivered.',
          ],
        },
        {
          title: '6. Cancellation or changes by organiser',
          content: [
            'If the camp must be cancelled due to unforeseen circumstances beyond reasonable control, participants will receive a full refund of all camp fees paid.',
            '',
            'Flights, travel costs and personal expenses remain the participant\'s responsibility.',
          ],
        },
        {
          title: '7. Unused services',
          content: [
            'No refunds or credits will be given for:',
            '',
            '• missed tennis sessions',
            '• unused meals or excursions',
            '• voluntary non-participation in scheduled activities',
          ],
        },
        {
          title: '8. Media consent',
          content: [
            'By participating in the camp, participants consent to photographs and videos being taken for use in promotions, marketing and social media. If you don\'t want to give your consent. If you don\'t want to give your consent, just give a heads up to the organiser to ensure your image won\'t be on any media.',
          ],
        },
      ],
      contact: 'If you have any other question regarding the policy, feel free to contact me through',
      email: 'hello@aceawaytravel.com',
      emailText: 'hello@aceawaytravel.com',
    },
    fr: {
      title: 'Annulation et remboursement',
      sections: [
        {
          title: '1. Paiement et inscription',
          content: [
            'Le prix total du camp est de 600 £ par participant.',
            'Un acompte de 250 £ est requis au moment de la réservation pour garantir une place.',
            'Le solde restant de 350 £ est dû 30 jours avant la date de début du camp.',
            '',
            'Un participant est considéré comme entièrement inscrit uniquement lorsque:',
            '1. Le paiement complet a été reçu, et',
            '2. Les détails du vol ont été fournis dans les 7 jours suivant la réservation.',
            '',
            'Le non-respect de la soumission des détails du vol dans les 7 jours entraînera un rappel. si les détails du vol ne sont toujours pas fournis, le participant sera considéré comme ne participant plus, et l\'acompte sera remboursé.',
            '',
            'Tous les paiements sont traités de manière sécurisée via Stripe.',
          ],
        },
        {
          title: '2. Annulation par le participant',
          content: [
            'Toutes les annulations doivent être soumises par écrit par email à hello@aceawaytravel.com',
            '',
            'Politique de remboursement (s\'applique à tous les paiements effectués jusqu\'à la date d\'annulation):',
            '',
            '• Plus de 60 jours avant la date de début: remboursement de tous les paiements effectués moins 150 £.',
            '• 30–60 jours avant la date de début: remboursement de 50% du prix total du camp (300 £).',
            '• Moins de 30 jours avant la date de début: aucun remboursement.',
            '• Absences, arrivées tardives ou départs anticipés: aucun remboursement ni crédit.',
            '',
            'Les transferts de réservation sont autorisés si le participant de remplacement correspond aux exigences du camp et n\'est pas débutant. toutes les autres règles et délais s\'appliquent toujours.',
            '',
            'Les remboursements couvrent tous les services de camp payés, à l\'exclusion des vols et des arrangements de voyage personnels.',
          ],
        },
        {
          title: '3. Vols et transfers aéroport',
          content: [
            'Les participants sont responsables de la réservation et du paiement de leurs propres vols.',
            '',
            'Un vol sera recommandé pour une arrivée le mercredi afin de coordonner les transferts de groupe. L\'arrivée le mercredi est obligatoire. le dîner du mercredi n\'est pas inclus; les participants sont responsables de ce repas.',
            '',
            'Les transferts aéroport pour les vols autres que les options recommandées ne peuvent pas être garantis, et tous les coûts de transport supplémentaires sont à la charge du participant. Aucun remboursement n\'est fourni pour les transports manqués ou retardés.',
          ],
        },
        {
          title: '4. Indisponibilité / blessure du coach',
          content: [
            'Dans le cas peu probable qu\'un coach soit indisponible en raison d\'une blessure ou d\'une maladie:',
            '',
            '• Les séances de tennis auront toujours lieu sur les courts en terre battue.',
            '• Les participants conserveront un accès complet aux courts et aux activités de tennis.',
            '• Tout remboursement de la partie coaching de tennis sera calculé sur la base des frais de coaching payés par le participant et traité immédiatement.',
            '',
            'Les remboursements ne s\'appliquent pas à l\'hébergement, aux repas, aux excursions ou à d\'autres services inclus.',
          ],
        },
        {
          title: '5. Conditions météorologiques',
          content: [
            'Le programme du camp comprend environ 9 heures de tennis par jour, sous réserve des conditions météorologiques.',
            '',
            '• Le tennis peut se poursuivre sous une pluie légère si les courts sont praticables.',
            '• Les séances peuvent être ajustées, raccourcies, reprogrammées ou remplacées par des activités de tennis alternatives si nécessaire.',
            '',
            'Les interruptions liées à la météo ne donnent pas droit aux participants à des remboursements, à condition qu\'un programme global raisonnable soit fourni.',
          ],
        },
        {
          title: '6. Annulation ou modifications par l\'organisateur',
          content: [
            'Si le camp doit être annulé en raison de circonstances imprévues au-delà d\'un contrôle raisonnable, les participants recevront un remboursement complet de tous les frais de camp payés.',
            '',
            'Les vols, les coûts de voyage et les dépenses personnelles restent à la charge du participant.',
          ],
        },
        {
          title: '7. Services non utilisés',
          content: [
            'Aucun remboursement ni crédit ne sera accordé pour:',
            '',
            '• les séances de tennis manquées',
            '• les repas ou excursions non utilisés',
            '• la non-participation volontaire aux activités programmées',
          ],
        },
        {
          title: '8. Consentement médias',
          content: [
            'En participant au camp, les participants consentent à ce que des photographies et des vidéos soient prises pour être utilisées dans les promotions, le marketing et les réseaux sociaux.',
          ],
        },
      ],
      contact: 'Si vous avez d\'autres questions concernant la politique, n\'hésitez pas à me contacter via',
      email: 'hello@aceawaytravel.com',
      emailText: 'hello@aceawaytravel.com',
    },
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* Header – aligned with registration page */}
      <header className="bg-white border-b-2 border-[#FF4C4C]/30 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-3 py-2.5 sm:px-4 sm:py-3 md:py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <Link href="/login" className="text-base md:text-lg font-bold text-[#FF4C4C] cursor-pointer">
            Tennis Camp Connect
          </Link>
          <img
            src="/logo.png"
            alt="Tennis Camp Connect"
            className="h-6 w-auto sm:h-7 md:h-8 flex-shrink-0 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl flex-1">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="flex items-center gap-1 self-start md:self-auto bg-gray-50 rounded-full px-1 py-0.5 border border-gray-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 text-[10px] md:text-xs lg:text-sm font-medium rounded-full transition-colors ${
                  language === 'en'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-1.5 py-0.5 text-[10px] md:text-xs lg:text-sm font-medium rounded-full transition-colors ${
                  language === 'fr'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                FR
              </button>
            </div>
            <h1 className="text-xs md:text-base lg:text-lg font-bold text-gray-900 leading-tight">
              {currentContent.title}
            </h1>
          </div>

          <div className="space-y-3">
            {currentContent.sections.map((section, index) => (
              <Collapsible
                key={index}
                title={section.title}
                defaultOpen={false}
              >
                <div className="pt-2 space-y-2 text-gray-700 leading-snug">
                  {section.content.map((paragraph, pIndex) => {
                    if (paragraph === '') {
                      return <div key={pIndex} className="h-2" />;
                    }
                    if (paragraph.startsWith('•')) {
                      return (
                        <p key={pIndex} className="pl-4 text-sm md:text-base">
                          {paragraph}
                        </p>
                      );
                    }
                    if (paragraph.match(/^\d+\./)) {
                      return (
                        <p key={pIndex} className="pl-4 text-sm md:text-base">
                          {paragraph}
                        </p>
                      );
                    }
                    return (
                      <p key={pIndex} className="text-sm md:text-base">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </Collapsible>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm md:text-base text-gray-700">
              {currentContent.contact}{' '}
              <a
                href={`mailto:${currentContent.email}`}
                className="text-[#2563EB] hover:text-[#1E40AF] underline font-medium"
              >
                {currentContent.emailText}
              </a>{' '}
              {language === 'en' ? 'at any time.' : 'à tout moment.'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 md:mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Tennis Camp Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
