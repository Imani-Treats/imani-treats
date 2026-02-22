"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { verifyPassword } from "./actions";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await verifyPassword(password);
    
    if (success) {
      router.push("/admin");
    } else {
      setError("Incorrect password.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-12 h-12 bg-orange-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-serif text-primary mb-2">Admin Access</h1>
        <p className="text-sm text-gray-500 mb-8">Enter your secure password to continue.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center tracking-widest"
          />
          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-md font-bold uppercase tracking-widest text-sm hover:bg-orange-700 transition-colors flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}