
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../app/utils/ThemeContext";
import { FaMoon, FaSun } from 'react-icons/fa';

const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Onboard Vendor", href: "/onboard-vendor" },
  { label: "Add Manually Vendor", href: "/add-manually-vendor" },
  { label: "Custom Booking", href: "/custom-booking" },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRole(typeof window !== "undefined" ? localStorage.getItem("role") : null);
  }, []);

  // Hide sidebar on login/forgot-password or if not Master Admin
  if (!mounted || !role || role !== "Master Admin" || ["/login", "/forgot-password"].includes(pathname)) {
    return <>{children}</>;
  }

  // Hamburger for mobile
  const Hamburger = () => (
    <button
      className={`md:hidden fixed top-4 left-4 z-30 p-2 rounded shadow transition-colors ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}
      onClick={() => setSidebarOpen(true)}
      aria-label="Open sidebar"
    >
      <svg className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
  );

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      <Hamburger />
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <aside className={`fixed md:static z-30 top-0 left-0 h-screen h-[200%] w-64 shadow flex flex-col justify-between border-r transform transition-transform duration-200 ease-in-out transition-colors
        ${isDark ? 'bg-black text-white border-slate-800' : 'bg-white text-gray-900 border-gray-200'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64`}>
        <div className={`relative p-6 text-2xl font-extrabold tracking-tight border-b flex items-center gap-2 transition-colors
          ${isDark ? 'text-white border-slate-800' : 'text-gray-900 border-gray-200'}`}>
          <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
           Admin   Panel          
<button
            onClick={toggleTheme}
            className={`absolute top-0 right-0 mt-1 mr-2 w-8 h-8 rounded-full shadow flex items-center justify-center border transition-colors
              ${isDark ? 'bg-black border-slate-700' : 'bg-white border-gray-200'}`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <FaSun className="text-yellow-400 text-sm" /> : <FaMoon className="text-gray-700 text-sm" />}
          </button>
        </div>
        <nav className={`flex-1 overflow-y-auto transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {SIDEBAR_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-3 flex items-center gap-3 font-medium rounded-lg transition-colors
                ${isDark ? `text-white hover:bg-slate-800 ${pathname === link.href ? 'bg-slate-800 font-bold' : ''}` : `text-gray-900 hover:bg-gray-100 ${pathname === link.href ? 'bg-gray-100 font-bold' : ''}`}`}
            >
              {link.label === "Dashboard" && <span><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm0-4h2V3H3v2zm4 0h2V3H7v2zm4 0h2V3h-2v2zm4 0h2V3h-2v2zM3 21h2v-2H3v2zm4 0h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z" /></svg></span>}
              {link.label === "Onboard Vendor" && <span><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></span>}
              {link.label === "Add Manually Vendor" && <span><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a8 8 0 11-16 0 8 8 0 0116 0z" /></svg></span>}
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Sidebar bottom section */}
        <div className={`flex flex-col gap-4 p-6 border-t transition-colors ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
          {/* Theme toggle moved to top right, nothing here now */}
          {/* Logout Icon Button */}
          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Logout</span>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-full transition-colors ${isDark ? 'bg-black hover:bg-red-700' : 'bg-white hover:bg-red-200'}`}
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-500" />
            </button>
          </div>
        </div>
      </aside>
      <style jsx global>{`
        /* No styles */
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s linear infinite alternate;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
      <main className={`flex-1 p-4 md:ml-[2px] overflow-y-auto transition-colors ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'}`}>{children}</main>
    </div>
  );
}
