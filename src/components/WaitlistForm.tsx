"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, BellRing, CheckCircle2 } from "lucide-react";

interface WaitlistFormProps {
  productName?: string;
  leadType?: 'general_newsletter' | 'product_waitlist';
}

export default function WaitlistForm({ 
  productName = "Any", 
  leadType = 'general_newsletter' 
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("You're on the list! We'll notify you.");

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg("");

    try {
      // 1. SMART CHECK: Does this user already have a PENDING request for this EXACT product/lead type?
      const { data: existing } = await supabase
        .from('waitlist')
        .select('id')
        .eq('email', email)
        .eq('product_name', productName)
        .eq('lead_type', leadType)
        .eq('status', 'pending')
        .single();

      // 2. If they are already waiting for this, just pretend it was a success!
      if (existing) {
        setSuccessMsg("You're already on the waitlist for this item!");
        setStatus('success');
        setEmail("");
        return;
      }

      // 3. If they aren't waiting for this item, insert a new row
      const { error } = await supabase.from('waitlist').insert([
        { 
          email, 
          product_name: productName,
          lead_type: leadType,
          status: 'pending' // Defaults to pending, but good to be explicit
        }
      ]);

      if (error) throw error;
      
      setSuccessMsg("You're on the list! We'll notify you.");
      setStatus('success');
      setEmail("");
    } catch (error: any) {
      console.error("Waitlist error:", error);
      setStatus('error');
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{successMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleJoinWaitlist} className="relative flex items-center max-w-[25rem] mx-auto">
        <div className="absolute left-4 text-gray-400"><BellRing className="w-4 h-4" /></div>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to get notified..."
          className="w-full bg-white text-primary border border-gray-200 pl-11 pr-32 py-3 md:py-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
        />
        <button type="submit" disabled={status === 'loading'} className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white px-4 md:px-6 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors disabled:opacity-70 flex items-center justify-center">
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Notify Me"}
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-500 font-bold mt-2 ml-4">{errorMsg}</p>}
    </div>
  );
}