"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, FileText, Info, MapPin, Smile } from "lucide-react";

export default function ContentManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    about_content: "",
    where_to_buy_content: "",
    fun_content: ""
  });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    setIsLoading(true);
    const { data } = await supabase.from('store_settings').select('*').eq('id', 1).single();
    if (data) {
      setFormData({
        about_content: data.about_content || "",
        where_to_buy_content: data.where_to_buy_content || "",
        fun_content: data.fun_content || ""
      });
    }
    setIsLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from('store_settings')
      .update({
        about_content: formData.about_content,
        where_to_buy_content: formData.where_to_buy_content,
        fun_content: formData.fun_content
      })
      .eq('id', 1);

    if (error) alert("Failed to save content.");
    else alert("Website content updated successfully!");
    
    setIsSaving(false);
  }

  if (isLoading) {
    return <div className="h-screen flex justify-center items-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary flex items-center gap-3">
          <FileText className="w-8 h-8" />
          Website Content
        </h1>
        <p className="text-sm text-gray-500 mt-1">Edit the text that appears in your website's navigation menus.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* About Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" /> "About Us" Text
          </h2>
          <textarea 
            required
            rows={4}
            value={formData.about_content}
            onChange={(e) => setFormData({...formData, about_content: e.target.value})}
            className="w-full border border-gray-200 p-4 rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-y"
            placeholder="Tell your customers your story..."
          />
        </div>

        {/* Where to Buy Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" /> "Where to Buy" Text
          </h2>
          <textarea 
            required
            rows={3}
            value={formData.where_to_buy_content}
            onChange={(e) => setFormData({...formData, where_to_buy_content: e.target.value})}
            className="w-full border border-gray-200 p-4 rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-y"
            placeholder="Explain how the drop model works..."
          />
        </div>

        {/* Fun Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Smile className="w-5 h-5 text-primary" /> "Fun" Text
          </h2>
          <textarea 
            required
            rows={3}
            value={formData.fun_content}
            onChange={(e) => setFormData({...formData, fun_content: e.target.value})}
            className="w-full border border-gray-200 p-4 rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-y"
            placeholder="Share a fun fact or joke..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-primary text-white px-8 py-3 rounded-md font-bold text-sm tracking-widest uppercase hover:bg-orange-700 transition flex items-center gap-2 shadow-lg"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Publish Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}