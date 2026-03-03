"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PackageSearch, Map, CalendarClock, LogOut, Users, FileText } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Do not show the sidebar on the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      // 1. Tell the server to securely destroy the cookie
      await fetch('/api/logout', { method: 'POST' });
      
      // 2. Clear client-side fallback just in case
      document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      
      // 3. Force a hard browser reload to the login page to clear Next.js memory cache
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { name: "Orders", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: PackageSearch },
    { name: "Delivery Zone", href: "/admin/delivery", icon: Map },
    { name: "Drop Date", href: "/admin/drop-date", icon: CalendarClock },
    { name: "Waitlist", href: "/admin/waitlist", icon: Users },
    { name: "Content", href: "/admin/content", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col md:sticky md:top-0 md:h-screen z-10 shadow-sm md:shadow-none">
        <div className="p-6 pt-8 md:pt-10 border-b border-gray-100 flex justify-between items-center md:block">
          <div>
            <h2 className="font-serif text-xl text-primary font-bold">Imani Treats</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Command Center</p>
          </div>
          
          {/* Mobile-Only Quick Logout Icon */}
          <button onClick={handleLogout} className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible flex md:flex-col items-center md:items-stretch scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Logout Button */}
        <div className="p-4 border-t border-gray-100 hidden md:block">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}