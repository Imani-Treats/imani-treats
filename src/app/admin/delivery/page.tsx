"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Edit, Trash2, MapPin, Truck, Save, X } from "lucide-react";

export default function DeliveryManager() {
  // Store Settings State (Pickup Address)
  const [pickupAddress, setPickupAddress] = useState("");
  const [isSavingPickup, setIsSavingPickup] = useState(false);

  // Delivery Zones State
  const [zones, setZones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSavingZone, setIsSavingZone] = useState(false);
  const [formData, setFormData] = useState({ state_name: "", fee: "" });

  useEffect(() => {
    fetchLogisticsData();
  }, []);

  async function fetchLogisticsData() {
    setIsLoading(true);
    
    // 1. Fetch Pickup Address
    const { data: settingsData } = await supabase.from('store_settings').select('pickup_address').eq('id', 1).single();
    if (settingsData) setPickupAddress(settingsData.pickup_address);

    // 2. Fetch Delivery Zones
    const { data: zonesData } = await supabase.from('delivery_zones').select('*').order('state_name', { ascending: true });
    if (zonesData) setZones(zonesData);
    
    setIsLoading(false);
  }

  // --- PICKUP ADDRESS LOGIC ---
  async function handleSavePickup(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingPickup(true);
    const { error } = await supabase.from('store_settings').update({ pickup_address: pickupAddress }).eq('id', 1);
    if (error) alert("Failed to update pickup address.");
    else alert("Pickup address updated successfully!");
    setIsSavingPickup(false);
  }

  // --- DELIVERY ZONES LOGIC ---
  function openModal(zone?: any) {
    if (zone) {
      setEditingId(zone.id);
      setFormData({ state_name: zone.state_name, fee: zone.fee.toString() });
    } else {
      setEditingId(null);
      setFormData({ state_name: "", fee: "" });
    }
    setIsModalOpen(true);
  }

  async function handleSaveZone(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingZone(true);

    const payload = {
      state_name: formData.state_name.trim(),
      fee: parseInt(formData.fee) || 0,
    };

    let error;
    if (editingId) {
      const res = await supabase.from('delivery_zones').update(payload).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('delivery_zones').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert(`Error saving zone: ${error.message}`);
    } else {
      setIsModalOpen(false);
      fetchLogisticsData();
    }
    setIsSavingZone(false);
  }

  async function handleDeleteZone(id: string) {
    if (!confirm("Are you sure you want to delete this delivery zone?")) return;
    await supabase.from('delivery_zones').delete().eq('id', id);
    fetchLogisticsData();
  }

  if (isLoading) return <div className="h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 md:p-8 mt-20 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-primary">Logistics & Delivery</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your pickup location and state delivery fees.</p>
      </div>

      {/* SECTION 1: Pickup Address */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" /> Global Pickup Address
        </h2>
        <form onSubmit={handleSavePickup} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            required
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="e.g., 123 Baker Street, Lagos"
            className="flex-1 border border-gray-200 p-3 rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <button 
            type="submit" 
            disabled={isSavingPickup}
            className="bg-primary text-white px-6 py-3 rounded-md font-bold text-sm tracking-widest uppercase hover:bg-orange-700 transition flex items-center justify-center gap-2 min-w-[150px]"
          >
            {isSavingPickup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSavingPickup ? "Saving..." : "Update"}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">This is the address shown to customers who select "Store Pickup" at checkout.</p>
      </div>

      {/* SECTION 2: Delivery Zones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" /> Delivery Zones
          </h2>
          <button 
            onClick={() => openModal()}
            className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-md font-bold text-xs tracking-widest uppercase hover:bg-gray-100 transition flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Zone
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 bg-white">
                <th className="p-4 font-bold">State / Zone Name</th>
                <th className="p-4 font-bold">Delivery Fee</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{zone.state_name}</td>
                  <td className="p-4 font-mono font-bold text-gray-900">₦{zone.fee.toLocaleString()}</td>
                  <td className="p-4 flex justify-end gap-3">
                    <button onClick={() => openModal(zone)} className="text-gray-500 hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteZone(zone.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {zones.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No delivery zones added yet. Add one to start shipping!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-serif text-primary">{editingId ? 'Edit Zone' : 'Add New Zone'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveZone} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">State Name</label>
                <input 
                  required 
                  placeholder="e.g., Abuja"
                  value={formData.state_name} 
                  onChange={e => setFormData({...formData, state_name: e.target.value})} 
                  className="w-full border p-2 text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Fee (₦)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="e.g., 5000"
                  value={formData.fee} 
                  onChange={e => setFormData({...formData, fee: e.target.value})} 
                  className="w-full border p-2 text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none font-mono" 
                />
              </div>

              <div className="pt-4 mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isSavingZone} className="px-5 py-2 bg-primary text-white text-sm font-bold uppercase tracking-wider rounded hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2">
                  {isSavingZone && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}