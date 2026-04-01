import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { listingId, buyerId, amount } = await req.json();

    if (!listingId || !buyerId || !amount) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    );

    // 1. Fetch listing details
    const { data: listing, error: listingError } = await supabase
      .from('carbon_listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing || listing.status !== 'available') {
      return NextResponse.json({ error: 'Listing not available' }, { status: 404 });
    }

    // 2. Fetch Farmer profile to check current balance
    const { data: farmer, error: farmerError } = await supabase
      .from('profiles')
      .select('carbon_credits')
      .eq('id', listing.farmer_id)
      .single();

    if (farmerError || !farmer || farmer.carbon_credits < amount) {
      return NextResponse.json({ error: 'Farmer has insufficient balance' }, { status: 400 });
    }

    // 3. ATOMIC UPDATES (Simulated transaction via multiple updates)
    // In production, use a Postgres RPC function for atomicity
    
    // Update listing to sold
    const { error: updateListingError } = await supabase
      .from('carbon_listings')
      .update({ status: 'sold' })
      .eq('id', listingId);

    if (updateListingError) throw new Error("Failed to update listing");

    // Deduct from farmer
    const { error: updateFarmerError } = await supabase
      .from('profiles')
      .update({ carbon_credits: farmer.carbon_credits - amount })
      .eq('id', listing.farmer_id);

    if (updateFarmerError) throw new Error("Failed to deduct from farmer");

    // Log transaction
    await supabase
      .from('transactions')
      .insert([{
        buyer_id: buyerId,
        farmer_id: listing.farmer_id,
        amount: amount * listing.price_per_credit,
        crop_type: 'carbon_credit',
        quantity: `${amount} Tonnes`,
        traceability_metadata: {
          listing_id: listingId,
          price_per_credit: listing.price_per_credit
        }
      }]);

    return NextResponse.json({ success: true, txId: listingId });
  } catch (error: any) {
    console.error('[buy-carbon] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
