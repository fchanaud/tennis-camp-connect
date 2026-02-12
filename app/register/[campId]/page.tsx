'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import type { Camp, RegistrationOptionType } from '@/types';

// Instagram icon with official gradient (coral, pink, purple)
const INSTAGRAM_ICON = (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEDA75" />
        <stop offset="25%" stopColor="#FA7E1E" />
        <stop offset="50%" stopColor="#D62976" />
        <stop offset="75%" stopColor="#962FBF" />
        <stop offset="100%" stopColor="#4F5BD5" />
      </linearGradient>
    </defs>
    <path
      fill="url(#instagram-gradient)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const OPTION_LABELS: Record<RegistrationOptionType, string> = {
  hammam_massage: 'Hammam / Massage (1 hour) - £45',
  massage: 'Massage (1 hour) - £40',
  hammam: 'Hammam (1 hour) - £25',
  medina_tour: 'Guided Medina walking tour (2 hours) - £30',
  friday_dinner: 'Moroccan traditional dinner on Friday - £30 (alcohol excluded)',
  racket_rental: 'Racket rental (provided on site) - £30',
};

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startStr = start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return `${startStr} - ${endStr}`;
}

// Basic email validation: @ present, something before and after, a dot in the domain
function isValidEmail(value: string): boolean {
  if (!value || value.length < 5) return false;
  const at = value.indexOf('@');
  if (at < 1 || at >= value.length - 1) return false;
  const after = value.slice(at + 1);
  if (!after.includes('.')) return false;
  if (/[\s]/.test(value)) return false;
  return true;
}

export default function RegistrationPage({ params }: { params: Promise<{ campId: string }> }) {
  const [camp, setCamp] = useState<Camp | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [availabilityError, setAvailabilityError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editingRegistrationId, setEditingRegistrationId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [tennisExperienceYears, setTennisExperienceYears] = useState('');
  const [playFrequency, setPlayFrequency] = useState('');
  const [bedroomType, setBedroomType] = useState('');
  const [optionalActivities, setOptionalActivities] = useState<string[]>([]);
  const [acceptedCancellationPolicy, setAcceptedCancellationPolicy] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    async function loadCamp() {
      try {
        const resolvedParams = await params;
        const { campId } = resolvedParams;

        // Check availability first
        const availabilityRes = await fetch(`/api/register/${campId}/check-availability`);
        const availabilityData = await availabilityRes.json();

        const regId = searchParams.get('registration_id');
        if (availabilityData.isFull && !regId) {
          setAvailabilityError(true);
          setLoading(false);
          return;
        }

        // Load camp details
        const campRes = await fetch(`/api/camps/${campId}`);
        if (!campRes.ok) {
          throw new Error('Camp not found');
        }
        const campData = await campRes.json();
        setCamp(campData);

        // If coming back from payment: load existing registration and pre-fill form
        if (regId) {
          setEditingRegistrationId(regId);
          try {
            const regRes = await fetch(`/api/register/${campId}/${regId}`);
            if (regRes.ok) {
              const data = await regRes.json();
              if (data.camp_id === campId) {
                const opts = data.registration_options || data.options || [];
                setName(data.name || '');
                setEmail(data.email || '');
                setWhatsappNumber(data.whatsapp_number || '');
                setTennisExperienceYears(data.tennis_experience_years || '');
                setPlayFrequency(data.play_frequency_per_month || '');
                setBedroomType(data.bedroom_type || '');
                setOptionalActivities(opts.map((o: { option_type: string }) => o.option_type));
                setAcceptedCancellationPolicy(!!data.accepted_cancellation_policy);
              }
            }
          } catch {
            setEditingRegistrationId(null);
          }
        } else {
          // If coming back from level-check: restore form from draft saved before redirect
          try {
            const raw = sessionStorage.getItem(`level_check_draft_${campId}`);
            if (raw) {
              const d = JSON.parse(raw);
              setName(d.name ?? '');
              setEmail(d.email ?? '');
              setWhatsappNumber(d.whatsapp_number ?? '');
              setTennisExperienceYears(d.tennis_experience_years ?? '');
              setPlayFrequency(d.play_frequency_per_month ?? '');
              setBedroomType(d.bedroom_type ?? '');
              setOptionalActivities(Array.isArray(d.optional_activities) ? d.optional_activities : []);
              setAcceptedCancellationPolicy(!!d.accepted_cancellation_policy);
              sessionStorage.removeItem(`level_check_draft_${campId}`);
            }
          } catch (_) {}
        }
      } catch (err) {
        setError('Failed to load camp information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCamp();
  }, [params, searchParams]);

  const handleOptionalActivityChange = (optionType: RegistrationOptionType) => {
    setOptionalActivities((prev) =>
      prev.includes(optionType)
        ? prev.filter((opt) => opt !== optionType)
        : [...prev, optionType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setSubmitting(true);

    try {
      const resolvedParams = await params;
      const { campId } = resolvedParams;

      // Basic email validation
      if (!isValidEmail(email)) {
        setEmailError('Please enter a valid email address (e.g. name@example.com)');
        setSubmitting(false);
        return;
      }

      // Validate form
      const whatsappDigits = whatsappNumber.replace(/\D/g, '');
      if (!whatsappDigits || whatsappDigits.length < 8) {
        setError('Please enter a valid WhatsApp number (with country code, e.g. +44 7123 456789)');
        setSubmitting(false);
        setTimeout(() => document.getElementById('registration-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        return;
      }
      if (!name || !email || !tennisExperienceYears ||
          !playFrequency || !bedroomType || !acceptedCancellationPolicy) {
        setError('Please fill in all required fields and accept the cancellation policy');
        setSubmitting(false);
        return;
      }

      // 1–2 years experience → redirect to level-check page (no registration created)
      // Save form to sessionStorage so "Back to registration" can restore it
      if (tennisExperienceYears === '1-2 years') {
        try {
          sessionStorage.setItem(`level_check_draft_${campId}`, JSON.stringify({
            name,
            email,
            whatsapp_number: whatsappNumber,
            tennis_experience_years: tennisExperienceYears,
            play_frequency_per_month: playFrequency,
            bedroom_type: bedroomType,
            optional_activities: optionalActivities,
            accepted_cancellation_policy: acceptedCancellationPolicy,
          }));
        } catch (_) {}
        router.push(`/register/${campId}/level-check`);
        setSubmitting(false);
        return;
      }

      // Show beginner-style popup only when: plays 1 time/month AND experience < 3 years.
      // If plays 1 time but has >= 3 years experience → no popup, go straight to payment.
      const hasAtLeast3YearsExperience = ['3-5 years', '6-8 years', '>8 years'].includes(tennisExperienceYears);
      const isLowLevel = playFrequency === '1 time' && !hasAtLeast3YearsExperience;

      const isUpdate = !!editingRegistrationId;

      const response = await fetch(`/api/register/${campId}`, {
        method: isUpdate ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isUpdate
            ? {
                registration_id: editingRegistrationId,
                name,
                email,
                whatsapp_number: whatsappDigits,
                tennis_experience_years: tennisExperienceYears,
                play_frequency_per_month: playFrequency,
                bedroom_type: bedroomType,
                accepted_cancellation_policy: acceptedCancellationPolicy,
                optional_activities: optionalActivities,
              }
            : {
                name,
                email,
                whatsapp_number: whatsappDigits,
                tennis_experience_years: tennisExperienceYears,
                play_frequency_per_month: playFrequency,
                bedroom_type: bedroomType,
                accepted_cancellation_policy: acceptedCancellationPolicy,
                optional_activities: optionalActivities,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.redirectTo === 'waitlist') {
          router.push(`/register/${campId}/waitlist`);
          return;
        }
        throw new Error(data.error || 'Failed to submit registration');
      }

      // If low level, show warning but still proceed (only on create, not on update)
      if (!isUpdate && isLowLevel) {
        alert('This camp is designed for intermediate and advanced players to ensure group homogeneity. Based on your answers, we\'d love to review your profile — please contact Ace Away Travel before proceeding.');
      }

      const regId = isUpdate ? editingRegistrationId : data.registration.id;
      router.push(`/register/${campId}/payment?registration_id=${regId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (availabilityError || !camp) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
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
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardBody className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Camp is Full</h1>
              <p className="text-gray-600 mb-6">
                This camp has reached its maximum capacity. Please check back for future camps.
              </p>
              <Button onClick={async () => {
                const resolvedParams = await params;
                router.push(`/register/${resolvedParams.campId}/waitlist`);
              }}>
                View Waitlist Information
              </Button>
            </CardBody>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
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
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl overflow-visible md:overflow-visible">
        <Card className="mb-6 border-2 border-[#2563EB]/30">
          <CardBody>
            <CardTitle className="text-2xl md:text-2xl mb-2 text-[#1E1E1E]">Marrakech Tennis Camp Registration</CardTitle>
            
            {/* Camp Dates - moved below main title */}
            <div className="mb-4">
              <p className="text-base md:text-lg font-bold text-[#66B032] bg-[#66B032]/10 px-2 py-1 rounded inline-block max-w-full overflow-hidden">
                <span className="whitespace-nowrap">{formatDateRange(camp.start_date, camp.end_date)}</span>
              </p>
              <p className="text-sm md:text-sm text-gray-700 mt-1">
                Open for intermediate and advanced levels
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-6">
              <p className="text-base md:text-gray-700 mb-2 text-gray-700">
                This camp is an extension of several individual tennis stays organised in Marrakech over recent months.
              </p>
              <p className="text-base md:text-gray-700 mb-4 text-gray-700">
                Based on consistent positive feedback, I decided to open it up to a small group, combining tennis coaching with an immersive Moroccan stay.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.tennis-camp-marrakech.com/testimonials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline font-medium"
                >
                  View testimonials
                </a>
                <a
                  href="https://www.instagram.com/aceaway.travel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#D62976]/50 focus:ring-offset-2"
                  aria-label="Ace Away Travel on Instagram"
                >
                  {INSTAGRAM_ICON}
                </a>
              </div>
            </div>

            {/* Camp Package */}
            <div className="mb-6 pl-4 border-l-4 border-[#66B032]">
              <h2 className="text-[10px] md:text-lg font-semibold mb-3 text-[#1E40AF]">Camp Package</h2>
              <ul className="list-disc list-inside space-y-2.5 text-[#1E1E1E] text-sm md:text-base leading-relaxed">
                <li>3 days of tennis coaching (9 hours) - maximum group size of 4 players</li>
                <li>Personal video analysis and post-camp feedback report</li>
                <li>Access to the Tennis Camp Connect app</li>
                <li>4 nights in a double shared room at the riad with daily breakfast (upgrade to private double room available)</li>
                <li>Every day lunch on the tennis camp site</li>
                <li>Thursday and Saturday Moroccan dinners at the riad</li>
                <li>All transfers (airport, tennis courts and activities)</li>
              </ul>

              <h3 className="text-sm md:text-md font-semibold mt-5 mb-2.5 text-gray-700">Not included:</h3>
              <ul className="list-disc list-inside space-y-2 text-[#1E1E1E] text-sm md:text-base leading-relaxed">
                <li>Flights to and from Marrakech</li>
                <li>Travel insurance</li>
                <li>Snacks and drinks</li>
                <li>Optional: Spa treatments, proposed excursions and Friday dinner</li>
              </ul>
            </div>
          </CardBody>
        </Card>

        {/* Registration Form */}
        <Card className="border-2 border-[#66B032]/30 overflow-visible md:overflow-visible">
          <CardBody className="overflow-visible md:overflow-visible">
            <CardTitle className="text-lg md:text-xl mb-4 text-[#1E40AF]">Registration Form</CardTitle>

            {error && (
              <div id="registration-error">
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-4 overflow-visible md:overflow-visible">
              <Input
                label="Name *"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email *"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                onBlur={() => email && !isValidEmail(email) && setEmailError('Please enter a valid email address')}
                error={emailError}
                required
              />

              <Input
                label="WhatsApp Number *"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9+\s]/g, ''))}
                placeholder="+44 7123 456789"
                required
              />

              <Select
                label="How many years of tennis experience do you have in total? *"
                value={tennisExperienceYears}
                onChange={(e) => setTennisExperienceYears(e.target.value)}
                options={[
                  { value: '', label: 'Select...' },
                  { value: '1-2 years', label: '1-2 years' },
                  { value: '3-5 years', label: '3-5 years' },
                  { value: '6-8 years', label: '6-8 years' },
                  { value: '>8 years', label: '>8 years' },
                ]}
                required
              />

              <Select
                label="How often do you currently play per month? *"
                value={playFrequency}
                onChange={(e) => setPlayFrequency(e.target.value)}
                options={[
                  { value: '', label: 'Select...' },
                  { value: '1 time', label: '1 time' },
                  { value: '2-3 times', label: '2-3 times' },
                  { value: '3-4 times', label: '3-4 times' },
                  { value: '>4 times', label: '>4 times' },
                ]}
                required
              />

              <Select
                label="Bedroom Type *"
                value={bedroomType}
                onChange={(e) => setBedroomType(e.target.value)}
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'shared', label: 'Shared double room' },
                  { value: 'private_double', label: 'Private double bedroom (+£90 in total)' },
                ]}
                required
              />

              {/* Optional Activities */}
              <div className="p-3 rounded-lg bg-[#FFD633]/10 border border-[#FFD633]/30 mb-8">
                <label className="form-label text-base md:text-base font-semibold text-[#1E1E1E] block !mb-5">
                  Optional Activities <span className="text-gray-500 font-normal text-sm md:text-sm">(can also be booked and paid later)</span>
                </label>
                <div className="space-y-1.5 md:space-y-2">
                  {(Object.keys(OPTION_LABELS) as RegistrationOptionType[]).map((optionType) => (
                    <label key={optionType} className="flex items-start gap-3 cursor-pointer min-h-[44px] py-0.5">
                      <input
                        type="checkbox"
                        checked={optionalActivities.includes(optionType)}
                        onChange={() => handleOptionalActivityChange(optionType)}
                        className="w-5 h-5 flex-shrink-0 cursor-pointer mt-0.5"
                      />
                      <span className="text-base md:text-sm text-gray-700 break-words leading-relaxed">{OPTION_LABELS[optionType]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
                  <input
                    type="checkbox"
                    checked={acceptedCancellationPolicy}
                    onChange={(e) => setAcceptedCancellationPolicy(e.target.checked)}
                    className="w-5 h-5 flex-shrink-0 cursor-pointer mt-0.5"
                    required
                  />
                  <span className="text-sm text-gray-700 break-words leading-relaxed">
                    I have read and agree to the{' '}
                    <Link
                      href="/cancellation-policy"
                      target="_blank"
                      className="text-[#2563EB] hover:underline font-medium"
                    >
                      Cancellation & refund policy
                    </Link>
                    . *
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={submitting}
                className="mt-3 md:mt-6"
              >
                {submitting
                  ? 'Submitting...'
                  : editingRegistrationId
                    ? 'Save and continue to payment'
                    : 'Register'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#2563EB]/5 to-[#66B032]/5 border-t-2 border-[#2563EB]/20 mt-12 md:mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Tennis Camp Connect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
