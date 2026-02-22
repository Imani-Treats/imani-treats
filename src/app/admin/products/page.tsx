"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Edit, Trash2, Package, Image as ImageIcon, UploadCloud, X } from "lucide-react";

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Multi-Image State
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<{file: File, preview: string}[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    variants: "", 
    is_active: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setIsLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  }

  function openModal(product?: any) {
    if (product) {
      setEditingId(product.id);
      setExistingImages(product.images || []);
      setNewFiles([]);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        stock: product.stock.toString(),
        variants: product.variants.join(", "),
        is_active: product.is_active
      });
    } else {
      setEditingId(null);
      setExistingImages([]);
      setNewFiles([]);
      setFormData({ name: "", description: "", price: "", stock: "", variants: "", is_active: true });
    }
    setIsModalOpen(true);
  }

  // Handle multiple file selection
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const mappedFiles = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setNewFiles(prev => [...prev, ...mappedFiles]);
    }
  }

  // Remove an image before saving
  function removeExistingImage(index: number) {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }
  function removeNewFile(index: number) {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const uploadedUrls: string[] = [];

    // 1. Upload all NEW files to Supabase Storage
    for (const item of newFiles) {
        const fileExt = item.file.name.split('.').pop();
        // Generate a clean filename using the current timestamp
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
        const { error: uploadError } = await supabase.storage
          .from('products') // Must match the bucket name exactly!
          .upload(fileName, item.file, {
            cacheControl: '3600',
            upsert: false,
            contentType: item.file.type // Explicitly tell Supabase it's an image
          });
  
        if (!uploadError) {
          const { data } = supabase.storage.from('products').getPublicUrl(fileName);
          uploadedUrls.push(data.publicUrl);
        } else {
          console.error("Failed to upload:", item.file.name, uploadError);
          alert(`Upload failed for ${item.file.name}. Check the console for details.`);
        }
      }

    // Combine the old images we kept + the newly uploaded ones
    const finalImagesArray = [...existingImages, ...uploadedUrls];

    // 2. Save Product to Database
    const payload = {
        name: formData.name,
        description: formData.description || "",
        price: parseInt(formData.price) || 0, // Fallback to 0 if NaN to prevent 400 errors
        stock: parseInt(formData.stock) || 0, // Fallback to 0 if NaN to prevent 400 errors
        images: finalImagesArray,
        variants: formData.variants ? formData.variants.split(",").map(s => s.trim()).filter(Boolean) : [],
        is_active: formData.is_active
      };
  
      let dbError;
  
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        dbError = error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        dbError = error;
      }
  
      // Check if the Database rejected the save
      if (dbError) {
        console.error("Database Save Error:", dbError);
        alert(`Database Error: ${dbError.message}`);
        setIsSaving(false);
        return; // Stop the function here so the modal doesn't close
      }
  
      // If everything succeeded!
      setIsModalOpen(false);
      fetchProducts();
      setIsSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  if (isLoading) return <div className="h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="p-6 md:p-8 mt-20 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-primary">Inventory Engine</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your treats, stock levels, and variants.</p>
        </div>
        <button onClick={() => openModal()} className="bg-primary text-white px-5 py-2.5 rounded-md font-bold text-sm tracking-widest uppercase hover:bg-orange-700 transition flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col ${!product.is_active && 'opacity-60 grayscale'}`}>
            
            {/* Main Image Display */}
            <div className="h-48 bg-gray-100 relative border-b border-gray-100 flex items-center justify-center overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-300" />
              )}
              {/* Badge showing how many extra images exist */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                  +{product.images.length - 1} Images
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{product.name}</h3>
                <span className="font-serif text-primary font-bold">₦{product.price.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{product.description}</p>
              <div className="mt-auto flex items-center gap-2 text-xs font-medium text-gray-600">
                <Package className="w-4 h-4" />
                {product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-500">Out of stock</span>}
              </div>
            </div>
            
            <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-between">
              <button onClick={() => openModal(product)} className="text-sm font-medium text-gray-600 hover:text-primary flex items-center gap-1 px-2 py-1"><Edit className="w-4 h-4" /> Edit</button>
              <button onClick={() => handleDelete(product.id)} className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1"><Trash2 className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-serif text-primary">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              
              {/* --- MULTI-IMAGE UPLOAD AREA --- */}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Product Images</label>
                
                {/* Image Gallery Preview */}
                <div className="flex flex-wrap gap-3 mb-3">
                  
                  {/* Existing Images */}
                  {existingImages.map((url, index) => (
                    <div key={`old-${index}`} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 group">
                      <img src={url} alt="existing" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-5 h-5 text-white" />
                      </button>
                      {index === 0 && <span className="absolute bottom-0 left-0 w-full bg-primary text-white text-[8px] text-center py-0.5 font-bold uppercase">Main</span>}
                    </div>
                  ))}

                  {/* New File Previews */}
                  {newFiles.map((item, index) => (
                    <div key={`new-${index}`} className="relative w-20 h-20 rounded-md overflow-hidden border border-primary group">
                      <img src={item.preview} alt="new" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewFile(index)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-5 h-5 text-white" />
                      </button>
                      <span className="absolute top-1 right-1 bg-white text-primary text-[8px] font-bold px-1 rounded">NEW</span>
                      {existingImages.length === 0 && index === 0 && <span className="absolute bottom-0 left-0 w-full bg-primary text-white text-[8px] text-center py-0.5 font-bold uppercase">Main</span>}
                    </div>
                  ))}

                  {/* Upload Button Block */}
                  <div className="relative w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Plus className="w-6 h-6" />
                  </div>

                </div>
                <p className="text-[10px] text-gray-500">Select multiple files at once. The first image in the list will be your main display image.</p>
              </div>

              {/* Standard Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (₦)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border p-2 text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full border p-2 text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2 text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Variants (Comma separated)</label>
                  <input placeholder="Box of 6, Box of 12" value={formData.variants} onChange={e => setFormData({...formData, variants: e.target.value})} className="w-full border p-2 text-sm rounded focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-primary accent-primary" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Product is active and visible on store</label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-primary text-white text-sm font-bold uppercase tracking-wider rounded hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}