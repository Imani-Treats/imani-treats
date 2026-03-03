"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Package, CheckCircle, Clock, Truck, Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";

const ITEMS_PER_PAGE = 15;

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search, Filter, & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    if (error) console.error("Error fetching orders:", error);
    setIsLoading(false);
  }

  // --- UPGRADED STATUS FUNCTION WITH RESTOCK LOGIC ---
  async function updateOrderStatus(id: string, newStatus: string, e?: React.ChangeEvent<HTMLSelectElement>) {
    e?.stopPropagation(); 
    
    // Find the current order so we know what items it has and its old status
    const orderToUpdate = orders.find(o => o.id === id);
    if (!orderToUpdate) return;
    
    const oldStatus = orderToUpdate.status;

    // 1. Update the status in the database
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (!error) {
      // 2. THE LOGIC: RESTOCK ITEMS (If changing to 'cancelled' from an active state)
      if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
        for (const item of orderToUpdate.items) {
          await supabase.rpc('restock_items', {
            product_id: item.id,
            quantity_to_add: item.quantity
          });
        }
      }
      
      // 3. THE FAILSAFE: DEDUCT ITEMS (If you accidentally cancelled and are changing it back to active)
      if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
        for (const item of orderToUpdate.items) {
          await supabase.rpc('deduct_stock', {
            product_id: item.id,
            quantity_to_deduct: item.quantity
          });
        }
      }

      // Update UI
      fetchOrders(); 
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } else {
      alert("Failed to update status");
    }
  }

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      (order.tracking_code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.reservation_code?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page to 1 when search or filter changes
  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center bg-gray-50 min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif text-primary">Orders Overview</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, filter, and track your incoming orders.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search codes or names..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-48 appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="reserved">Reserved</option>
                <option value="paid">Paid</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-bold">Code</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Delivery</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {paginatedOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-orange-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="text-xs font-mono font-bold text-gray-900 group-hover:text-primary">
                        {order.tracking_code || order.reservation_code || 'N/A'}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{order.customer_name}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.delivery_method === 'pickup' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      }`}>
                        {order.delivery_method === 'pickup' ? <Package className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                        {order.delivery_method}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      ₦{order.total_amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'paid' || order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'delivered' ? 'bg-gray-100 text-gray-600' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {order.status === 'paid' || order.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> : 
                         order.status === 'cancelled' ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={order.status}
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value, e)}
                        className="text-xs border border-gray-200 rounded p-1 outline-none focus:border-primary cursor-pointer bg-white"
                      >
                        <option value="pending_payment">Pending Payment</option>
                        <option value="reserved">Reserved</option>
                        <option value="paid">Paid</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500">
                      No orders found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 disabled:opacity-50 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-gray-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 disabled:opacity-50 hover:text-primary transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* --- ORDER DETAIL MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif text-primary">Order Details</h2>
                <p className="text-sm text-gray-500 mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8">
              
              {/* Customer & Codes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Customer Info</h3>
                  <p className="font-medium text-gray-900">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedOrder.customer_email}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedOrder.customer_phone}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Reference Codes</h3>
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                    <span className="text-sm text-gray-500">Tracking Code</span>
                    <span className="font-mono font-bold text-gray-900">{selectedOrder.tracking_code || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Reservation Code</span>
                    <span className="font-mono font-bold text-gray-900">{selectedOrder.reservation_code || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Ordered Items</h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white">
                      <div>
                        <p className="font-medium text-gray-900">{item.quantity}x {item.name}</p>
                        {item.variant && <p className="text-xs text-gray-500 mt-1">Variant: {item.variant}</p>}
                      </div>
                      <p className="font-medium text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financials & Delivery */}
              <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 font-medium">Delivery Method:</span>
                  <span className="text-sm font-bold text-gray-900 uppercase">{selectedOrder.delivery_method}</span>
                </div>
                {selectedOrder.delivery_method === 'delivery' && (
                  <div className="mb-4 text-right">
                    <p className="text-xs text-gray-500">Address:</p>
                    <p className="text-sm text-gray-900 font-medium">{selectedOrder.delivery_address}</p>
                    <p className="text-sm text-gray-900 font-medium">{selectedOrder.delivery_state}</p>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">₦{(selectedOrder.total_amount - selectedOrder.delivery_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-4 border-b border-orange-200 pb-4">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="text-sm font-medium text-gray-900">₦{selectedOrder.delivery_fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-serif text-primary">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">₦{selectedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}