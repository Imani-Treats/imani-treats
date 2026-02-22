"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CalendarClock, Save } from "lucide-react";

export default function DropDateSettings() {
  const [dropDate, setDropDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDropDate();
  }, []);

  async function fetchDropDate() {
    const { data, error } = await supabase
      .from('store_settings')
      .select('next_drop_date')
      .eq('id', 1)
      .single();

    if (data?.next_drop_date) {
      // Format the Supabase timestamp into a format the HTML datetime-local input understands (YYYY-MM-DDTHH:mm)
      const dateObj = new Date(data.next_drop_date);
      // Adjust for local timezone offset for the input field
      const tzoffset = dateObj.getTimezoneOffset() * 60000; 
      const localISOTime = (new Date(dateObj.getTime() - tzoffset)).toISOString().slice(0, 16);
      
      setDropDate(localISOTime);
    }
    setIsLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    // Convert the local input back to a standard UTC timestamp for Supabase
    const timestamp = new Date(dropDate).toISOString();

    const { error } = await supabase
      .from('store_settings')
      .update({ next_drop_date: timestamp })
      .eq('id', 1);

    if (error) {
      setMessage("❌ Failed to update drop date.");
    } else {
      setMessage("✅ Drop date updated successfully! The homepage timer is now live.");
    }
    setIsSaving(false);
  }

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-8 mt-20 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary flex items-center gap-3">
          <CalendarClock className="w-8 h-8" />
          Global Drop Date
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Set the exact date and time for your next drop. This controls the main countdown timer on the homepage.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
              Next Drop Date & Time
            </label>
            <input 
              type="datetime-local" 
              required
              value={dropDate}
              onChange={(e) => setDropDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg font-mono"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors w-full md:w-auto"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Saving..." : "Update Live Timer"}
          </button>

          {message && (
            <p className={`text-sm font-bold ${message.includes("❌") ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}