'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { User, Camp } from '@/types';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  user: User | null;
  camps?: Camp[];
}

export function Navbar({ user, camps = [] }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campDropdownOpen, setCampDropdownOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      window.location.href = '/login';
    }
  };

  const isActive = (path: string) => pathname?.startsWith(path);

  const renderPlayerNav = () => {
    const activeCamp = camps[0]; // Default to first camp
    
    return (
      <>
        <Link
          href="/home"
          className={`px-4 py-2 transition-colors ${isActive('/home') ? 'text-[#FF4C4C] font-semibold' : 'text-gray-700 hover:text-[#FF4C4C]'}`}
        >
          Home
        </Link>
        
        {activeCamp && (
          <div className="relative">
            <button
              onClick={() => setCampDropdownOpen(!campDropdownOpen)}
              className="px-4 py-2 flex items-center gap-1 text-gray-700 hover:text-[#FF4C4C] transition-colors"
            >
              Current Camp
              <ChevronDown className={`w-4 h-4 transition-transform ${campDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {campDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-soft border border-gray-200 py-2 min-w-[200px] z-50">
                <Link
                  href={`/camp/${activeCamp.id}/tennis`}
                  className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => setCampDropdownOpen(false)}
                >
                  Tennis
                </Link>
                <Link
                  href={`/camp/${activeCamp.id}/schedule`}
                  className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => setCampDropdownOpen(false)}
                >
                  Schedule
                </Link>
                {(activeCamp.package === 'stay_and_play' || 
                  activeCamp.package === 'luxury_stay_and_play' || 
                  activeCamp.package === 'no_tennis') && (
                  <Link
                    href={`/camp/${activeCamp.id}/stay`}
                    className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => setCampDropdownOpen(false)}
                  >
                    Stay
                  </Link>
                )}
                <Link
                  href={`/camp/${activeCamp.id}/essentials`}
                  className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => setCampDropdownOpen(false)}
                >
                  Essentials
                </Link>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const renderCoachNav = () => (
    <>
      <Link
        href="/home"
        className={`px-4 py-2 transition-colors ${isActive('/home') ? 'text-[#FF4C4C] font-semibold' : 'text-gray-700 hover:text-[#FF4C4C]'}`}
      >
        Home
      </Link>
      <Link
        href="/coach/players"
        className={`px-4 py-2 transition-colors ${isActive('/coach/players') ? 'text-[#FF4C4C] font-semibold' : 'text-gray-700 hover:text-[#FF4C4C]'}`}
      >
        Players
      </Link>
    </>
  );

  const renderAdminNav = () => (
    <>
      <Link
        href="/home"
        className={`px-4 py-2 transition-colors ${isActive('/home') ? 'text-[#FF4C4C] font-semibold' : 'text-gray-700 hover:text-[#FF4C4C]'}`}
      >
        Home
      </Link>
      <Link
        href="/admin/users"
        className={`px-4 py-2 transition-colors ${isActive('/admin/users') ? 'text-[#FF4C4C] font-semibold' : 'text-gray-700 hover:text-[#FF4C4C]'}`}
      >
        User Management
      </Link>
      <Link
        href="/admin/camps"
        className={`px-4 py-2 transition-colors ${isActive('/admin/camps') ? 'text-[#FF4C4C] font-semibold' : 'text-gray-700 hover:text-[#FF4C4C]'}`}
      >
        Camp Management
      </Link>
    </>
  );

  if (!user) return null;

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/home" className="text-2xl font-bold text-[#FF4C4C]">
            Tennis Camp Connect
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user.role === 'player' && renderPlayerNav()}
            {user.role === 'coach' && renderCoachNav()}
            {user.role === 'admin' && renderAdminNav()}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {user.role === 'player' && (
                <>
                  <Link
                    href="/home"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  {camps[0] && (
                    <>
                      <Link
                        href={`/camp/${camps[0].id}/tennis`}
                        className="px-4 py-2 hover:bg-gray-50 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Tennis
                      </Link>
                      <Link
                        href={`/camp/${camps[0].id}/schedule`}
                        className="px-4 py-2 hover:bg-gray-50 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Schedule
                      </Link>
                      {(camps[0].package === 'stay_and_play' || 
                        camps[0].package === 'luxury_stay_and_play' || 
                        camps[0].package === 'no_tennis') && (
                        <Link
                          href={`/camp/${camps[0].id}/stay`}
                          className="px-4 py-2 hover:bg-gray-50 rounded"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Stay
                        </Link>
                      )}
                      <Link
                        href={`/camp/${camps[0].id}/essentials`}
                        className="px-4 py-2 hover:bg-gray-50 rounded"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Essentials
                      </Link>
                    </>
                  )}
                </>
              )}
              {user.role === 'coach' && (
                <>
                  <Link
                    href="/home"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/coach/players"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Players
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link
                    href="/home"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/admin/users"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    User Management
                  </Link>
                  <Link
                    href="/admin/camps"
                    className="px-4 py-2 hover:bg-gray-50 rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Camp Management
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-50 rounded text-left flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

