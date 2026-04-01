"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Armchair, ChevronLeft, CreditCard, ShieldCheck, Mail, CheckCircle, Info, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function SeatBooking({ params }: { params: Promise<{ id: string }> }) {
  const { id: auctionId } = use(params);
  const [auction, setAuction] = useState<any>(null);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [step, setStep] = useState<"select" | "payment" | "confirmed">("select");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [auctionId]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Auction
    const { data: auctionData } = await supabase.from("auctions").select("*").eq("id", auctionId).single();
    setAuction(auctionData);

    // Fetch Booked Seats
    const { data: seatsData } = await supabase.from("auction_seats").select("seat_number").eq("auction_id", auctionId);
    setBookedSeats(seatsData?.map(s => s.seat_number) || []);
    
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!selectedSeat || !termsAccepted) return;
    setBooking(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const { error } = await supabase.from("auction_seats").insert({
      auction_id: auctionId,
      user_id: user.id,
      seat_number: selectedSeat,
      fee_paid: true,
      terms_accepted: true
    });

    if (!error) {
      // Simulate Email Sending via API (Nodemailer)
      await fetch("/api/auction/confirm", {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          seat: selectedSeat,
          auction: auction.title,
          time: auction.scheduled_at
        })
      });
      setStep("confirmed");
    } else {
      alert("Seat already reserved or booking failed.");
    }
    setBooking(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500 font-mono text-sm uppercase animate-pulse">
      INITIALIZING_SEAT_GRID...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 pt-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-bold">{auction?.title}</h1>
            <p className="text-sm text-emerald-500 font-mono">₹1,000 Entry Fee</p>
          </div>
        </div>

        {step === "select" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Seat Selection Grid */}
            <div className="lg:col-span-2 glass rounded-3xl p-8 border-white/5">
              <div className="flex items-center justify-center gap-8 mb-10 text-xs font-mono uppercase tracking-widest text-zinc-500">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-zinc-800 border border-white/10" />
                  Available
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-red-600/50" />
                  Reserved
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-emerald-500" />
                  Selected
                </div>
              </div>

              <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-2 max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                {Array.from({ length: 300 }, (_, i) => i + 1).map((seat) => {
                  const isBooked = bookedSeats.includes(seat);
                  const isSelected = selectedSeat === seat;
                  return (
                    <button
                      key={seat}
                      disabled={isBooked}
                      onClick={() => setSelectedSeat(seat)}
                      className={`h-6 w-6 rounded-sm text-[8px] flex items-center justify-center transition-all ${
                        isBooked 
                          ? "bg-red-950/20 text-red-900 border border-red-900/10 cursor-not-allowed" 
                          : isSelected
                          ? "bg-emerald-500 text-black border-emerald-400 scale-110 shadow-lg shadow-emerald-500/50"
                          : "bg-zinc-900 border border-white/10 text-zinc-500 hover:border-emerald-500/50 hover:text-white"
                      }`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-12 w-full h-8 rounded-full bg-gradient-to-t from-emerald-500/5 to-transparent border-t border-emerald-500/10 flex items-center justify-center">
                <div className="text-[10px] font-mono text-emerald-500/50 tracking-[0.5em] uppercase">Auction Stage Entrance</div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
              <div className="glass rounded-3xl p-8 border-white/5 bg-emerald-500/5 ring-1 ring-emerald-500/20">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Armchair className="h-5 w-5 text-emerald-500" />
                  Reservation Details
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Selected Seat</span>
                    <span className="text-white font-bold">{selectedSeat ? `Seat #${selectedSeat}` : 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Booking Fee</span>
                    <span className="text-white font-bold">₹1,000</span>
                  </div>
                  <hr className="border-white/5" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Due</span>
                    <span className="text-emerald-500">₹1,000</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mt-1 accent-emerald-500" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      I agree to provide <span className="text-emerald-400 underline decoration-emerald-500/30">QR-based traceability</span> for all farmer products purchased during the auction.
                    </span>
                  </label>
                </div>

                <button
                  disabled={!selectedSeat || !termsAccepted || booking}
                  onClick={() => setStep("payment")}
                  className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-900/40 transition-all hover:bg-emerald-500 hover:scale-[1.02] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                >
                  Proceed to Payment
                </button>

                <p className="text-[10px] text-center text-zinc-600 mt-4 font-mono uppercase tracking-widest">
                  Secure Encryption Active
                </p>
              </div>

              <div className="glass rounded-3xl p-6 border-white/5">
                <h4 className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-2 mb-4">
                  <Info className="h-4 w-4" />
                  Auction Tokenomics
                </h4>
                <ul className="text-[11px] text-zinc-500 space-y-2 list-disc pl-4">
                  <li>60% fee refund (₹600) upon placing a valid bid.</li>
                  <li>No refund if the participant remains idle.</li>
                  <li>Blockchain hash included in email receipt.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="max-w-md mx-auto text-center py-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-12 rounded-[2.5rem] border-emerald-500/20"
            >
              <div className="h-16 w-16 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                <CreditCard className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Simulate Payment</h2>
              <p className="text-zinc-500 text-sm mb-10">This is a dummy payment process for demo purposes.</p>
              
              <button 
                onClick={handleBooking}
                disabled={booking}
                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {booking ? "Processing..." : "Complete Checkout (₹1,000)"}
              </button>
            </motion.div>
          </div>
        )}

        {step === "confirmed" && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-12 rounded-[2.5rem] border-emerald-500/20"
            >
              <div className="h-20 w-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/10">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Seat Secured!</h1>
              <p className="text-zinc-400 mb-2">You are now registered for the auction.</p>
              <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-sm bg-emerald-500/10 px-4 py-2 rounded-full mb-10">
                <ShieldCheck className="h-4 w-4" />
                SEAT_ASSIGNED: #{selectedSeat}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 mb-4">
                    <Mail className="h-5 w-5 text-emerald-500" />
                  </div>
                  <h4 className="text-sm font-bold">Email Receipt</h4>
                  <p className="text-xs text-zinc-500 mt-1">Check your inbox for terms and seat number.</p>
                </div>
                <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 mb-4">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-bold">Auction Access</h4>
                  <p className="text-xs text-zinc-500 mt-1">Room opens 30m prior to scheduled start.</p>
                </div>
              </div>

              <Link 
                href="/"
                className="inline-flex items-center gap-2 py-4 px-10 rounded-2xl bg-zinc-900 text-white font-bold border border-white/10 hover:bg-zinc-800 transition-all"
              >
                Return to Ecosystem
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
