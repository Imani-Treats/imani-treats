"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Users, ShoppingCart, Mail, CheckCircle, Clock, Copy, Trash2, CheckSquare, Filter } from "lucide-react";

export default function WaitlistDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'checkout_abandonment' | 'product_waitlist' | 'general_newsletter'>('all');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'notified'>('pending');
  const [productFilter, setProductFilter] = useState<string>('all'); // <--- NEW PRODUCT FILTER

  // UI State
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data);
    if (error) console.error("Error fetching waitlist:", error);
    setIsLoading(false);
  }

  // --- ACTIONS ---
  async function markAsNotified(id: string) {
    const { error } = await supabase.from('waitlist').update({ status: 'notified' }).eq('id', id);
    if (!error) {
      setLeads(leads.map(lead => lead.id === id ? { ...lead, status: 'notified' } : lead));
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const { error } = await supabase.from('waitlist').delete().eq('id', id);
    if (!error) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  }

  function copyEmails(emailList: string[]) {
    if (emailList.length === 0) return;
    const emailString = emailList.join(", ");
    navigator.clipboard.writeText(emailString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // --- EXTRACT UNIQUE PRODUCTS FOR DROPDOWN ---
  // This automatically finds every unique product name in your leads list
  const uniqueProducts = Array.from(new Set(leads.map(lead => lead.product_name)))
    .filter(Boolean)
    .sort();

  // --- FILTERING LOGIC ---
  const filteredLeads = leads.filter(lead => {
    const matchesTab = activeTab === 'all' || lead.lead_type === activeTab;
    const safeStatus = lead.status || 'pending'; // Fixes the invisible leads bug!
    const matchesStatus = safeStatus === statusFilter;
    
    // NEW: Check if the product matches the dropdown
    const matchesProduct = productFilter === 'all' || lead.product_name === productFilter;
    
    return matchesTab && matchesStatus && matchesProduct;
  });

  const emailsToCopy = filteredLeads.map(lead => lead.email);

  // Reset product filter if user switches tabs (for better UX)
  useEffect(() => {
    setProductFilter('all');
  }, [activeTab]);

  // --- UI HELPERS ---
  const getLeadBadge = (type: string) => {
    if (type === 'checkout_abandonment') return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Abandoned Cart</span>;
    if (type === 'product_waitlist') return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Product Request</span>;
    return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">General Lead</span>;
  };

  if (isLoading) {
    return <div className="h-screen flex justify-center items-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen mt-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary flex items-center gap-3">
            <Users className="w-8 h-8" />
            Lead Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage waitlists, recover abandoned carts, and export emails.</p>
        </div>
        
        {/* Status Toggle (Pending vs Notified) */}
        <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          <button 
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${statusFilter === 'pending' ? 'bg-orange-50 text-primary' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Needs Action
          </button>
          <button 
            onClick={() => setStatusFilter('notified')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${statusFilter === 'notified' ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Notified
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Top Controls: Tabs, Product Dropdown & Copy Button */}
        <div className="flex flex-col xl:flex-row justify-between items-center border-b border-gray-100 bg-gray-50 p-4 gap-4">
          
          <div className="flex gap-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0">
            <button onClick={() => setActiveTab('all')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === 'all' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:bg-gray-200/50'}`}>
              All Leads
            </button>
            <button onClick={() => setActiveTab('checkout_abandonment')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === 'checkout_abandonment' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:bg-gray-200/50'}`}>
              <ShoppingCart className="w-4 h-4" /> Abandoned Carts
            </button>
            <button onClick={() => setActiveTab('product_waitlist')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === 'product_waitlist' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:bg-gray-200/50'}`}>
              <Clock className="w-4 h-4" /> Waitlists
            </button>
            <button onClick={() => setActiveTab('general_newsletter')} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === 'general_newsletter' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:bg-gray-200/50'}`}>
              <Mail className="w-4 h-4" /> General
            </button>
          </div>

          {/* Right Side Controls: Filter & Copy */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            
            {/* NEW: Product Dropdown */}
            <div className="relative w-full sm:w-auto">
              <Filter className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <select 
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white font-medium text-gray-700"
              >
                <option value="all">All Products</option>
                {uniqueProducts.map((product: any) => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => copyEmails(emailsToCopy)}
              disabled={emailsToCopy.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-5 py-2 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-orange-700 transition-all disabled:opacity-50"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : `Copy ${emailsToCopy.length} Emails`}
            </button>
          </div>

        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 bg-white">
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Target Product</th>
                <th className="p-4 font-bold">Date Joined</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-medium text-gray-900">{lead.email}</td>
                  <td className="p-4">{getLeadBadge(lead.lead_type)}</td>
                  <td className="p-4 font-medium text-gray-600">
                    {lead.product_name === 'Any' || lead.product_name === 'Pending Cart' ? (
                      <span className="text-gray-400 italic">{lead.product_name}</span>
                    ) : (
                      lead.product_name
                    )}
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    {lead.status !== 'notified' && (
                      <button 
                        onClick={() => markAsNotified(lead.id)}
                        className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-green-100 transition-colors"
                        title="Mark as Notified"
                      >
                        <CheckSquare className="w-3.5 h-3.5" /> Resolve
                      </button>
                    )}
                    <button 
                      onClick={() => deleteLead(lead.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500 bg-gray-50/50">
                    <Mail className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-900">No leads found.</p>
                    <p className="text-xs mt-1">There are no leads matching your current filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}