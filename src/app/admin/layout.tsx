"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PackageSearch, Map, CalendarClock, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Do not show the sidebar on the login page itself
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    // Clear the cookie from the client side
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/admin/login");
  };

  // --- UPDATED NAVIGATION MENU ---
  const navItems = [
    { name: "Orders", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: PackageSearch },
    { name: "Delivery Zone", href: "/admin/delivery", icon: Map },
    { name: "Drop Date", href: "/admin/drop-date", icon: CalendarClock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-74 bg-white border-r border-gray-200 flex flex-col md:sticky md:top-0 md:h-screen z-10">
        <div className="p-6 pt-30 border-b border-gray-100">
        
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Command Center</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-x-auto md:overflow-visible flex md:flex-col">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all min-w-max ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

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