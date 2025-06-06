"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../app/utils/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import ProfileDrawer from "./ProfileDrawer";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Onboard Vendor", href: "/onboard-vendor" },
  { label: "Add Manually Vendor", href: "/add-manually-vendor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  // Profile state
  const [profile, setProfile] = useState({
    name: "Master Admin",
    email: "admin@email.com",
    image: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("profile");
      if (stored) setProfile(JSON.parse(stored));
    }
  }, []);

  // Save profile to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }, [profile]);

  const handleEditProfile = (data: typeof profile) => {
    setProfile(data);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <nav className={`w-full z-40 sticky top-0 shadow-md transition-colors duration-200 ${isDark ? 'bg-slate-900 border-b border-slate-800 mb-[1px]' : 'bg-white border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-blue-600 dark:text-blue-400 select-none">
            <svg className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Admin Panel
          </div>
          <div className="hidden md:flex gap-2 lg:gap-4 items-center">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 ${pathname === link.href ? 'bg-blue-100 text-blue-700 dark:bg-slate-800 dark:text-blue-400 font-bold' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-slate-800 dark:hover:text-blue-300'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors duration-150 shadow-sm ${isDark ? 'bg-slate-800 border-slate-600 text-yellow-400' : 'bg-white border-gray-300 text-blue-500'}`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>
            {/* Profile Avatar */}
            <button
              className="ml-2 flex items-center focus:outline-none"
              onClick={() => setDrawerOpen(true)}
              title="Profile"
            >
              {profile.image ? (
                <img src={profile.image} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-400 object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-base text-blue-700 border border-blue-200">
                  {profile.name?.[0]?.toUpperCase() || 'A'}
                </div>
              )}
            </button>
            <ProfileDrawer
              open={drawerOpen}
              profile={profile}
              onClose={() => setDrawerOpen(false)}
              onLogout={handleLogout}
              onEdit={handleEditProfile}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
