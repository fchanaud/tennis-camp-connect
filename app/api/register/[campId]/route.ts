import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import type { RegistrationOptionType } from '@/types';

const OPTION_PRICES: Record<RegistrationOptionType, number> = {
  hammam_massage: 45,
  massage: 40,
  hammam: 25,
  medina_tour: 30,
  friday_dinner: 30,
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campId: string }> }
) {
  try {
    const { campId } = await params;
    const body = await request.json();
    const supabase = createServiceRoleClient();

    const {
      name,
      email,
      whatsapp_number,
      tennis_experience_years,
      play_frequency_per_month,
      bedroom_type,
      accepted_cancellation_policy,
      optional_activities = [],
    } = body;

    // Validate required fields
    if (!name || !email || !whatsapp_number || !tennis_experience_years || 
        !play_frequency_per_month || !bedroom_type || !accepted_cancellation_policy) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Check if camp exists
    const { data: camp, error: campError } = await supabase
      .from('camps')
      .select('id, max_players')
      .eq('id', campId)
      .single();

    if (campError || !camp) {
      return NextResponse.json(
        { error: 'Camp not found' },
        { status: 404 }
      );
    }

    // Check if camp is full
    const { count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('camp_id', campId)
      .eq('status', 'confirmed');

    const maxPlayers = camp.max_players || 7;
    if ((count || 0) >= maxPlayers) {
      return NextResponse.json(
        { error: 'Camp is full', redirectTo: 'waitlist' },
        { status: 400 }
      );
    }

    // Create registration
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .insert({
        camp_id: campId,
        name,
        email,
        whatsapp_number,
        tennis_experience_years,
        play_frequency_per_month,
        bedroom_type,
        accepted_cancellation_policy,
        status: 'pending',
      })
      .select()
      .single();

    if (regError || !registration) {
      console.error('Registration error:', regError);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Add optional activities
    if (optional_activities && optional_activities.length > 0) {
      const optionsToInsert = optional_activities.map((optionType: RegistrationOptionType) => ({
        registration_id: registration.id,
        option_type: optionType,
        price_pounds: OPTION_PRICES[optionType],
      }));

      const { error: optionsError } = await supabase
        .from('registration_options')
        .insert(optionsToInsert);

      if (optionsError) {
        console.error('Options error:', optionsError);
        // Don't fail the registration if options fail, just log it
      }
    }

    return NextResponse.json({
      registration,
      success: true,
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ campId: string }> }
) {
  try {
    const { campId } = await params;
    const body = await request.json();
    const supabase = createServiceRoleClient();

    const {
      registration_id,
      name,
      email,
      whatsapp_number,
      tennis_experience_years,
      play_frequency_per_month,
      bedroom_type,
      accepted_cancellation_policy,
      optional_activities = [],
    } = body;

    if (!registration_id || !name || !email || !whatsapp_number || !tennis_experience_years ||
        !play_frequency_per_month || !bedroom_type || accepted_cancellation_policy === undefined) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Fetch existing registration and ensure it belongs to this camp
    const { data: existing, error: fetchError } = await supabase
      .from('registrations')
      .select('id, camp_id')
      .eq('id', registration_id)
      .single();

    if (fetchError || !existing || existing.camp_id !== campId) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Update registration
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        name,
        email,
        whatsapp_number,
        tennis_experience_years,
        play_frequency_per_month,
        bedroom_type,
        accepted_cancellation_policy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', registration_id);

    if (updateError) {
      console.error('Update registration error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update registration' },
        { status: 500 }
      );
    }

    // Replace optional activities: delete existing, insert new
    await supabase
      .from('registration_options')
      .delete()
      .eq('registration_id', registration_id);

    if (optional_activities && optional_activities.length > 0) {
      const optionsToInsert = optional_activities.map((optionType: RegistrationOptionType) => ({
        registration_id,
        option_type: optionType,
        price_pounds: OPTION_PRICES[optionType],
      }));
      const { error: optionsError } = await supabase
        .from('registration_options')
        .insert(optionsToInsert);
      if (optionsError) {
        console.error('Options update error:', optionsError);
      }
    }

    return NextResponse.json({
      registration: { id: registration_id },
      success: true,
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
