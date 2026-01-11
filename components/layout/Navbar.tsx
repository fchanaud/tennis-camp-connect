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

  const isActive = (path: string) => {
    if (!pathname) return false;
    // Exact match for home
    if (path === '/home') return pathname === '/home';
    // For camp routes, check if pathname includes the path segment
    return pathname.includes(path);
  };

  const renderPlayerNav = () => {
    const activeCamp = camps[0]; // Default to first camp
    const hasAccommodation = activeCamp && activeCamp.package !== 'tennis_only';
    
    return (
      <>
        <Link
          href="/home"
          className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
        >
          Home
        </Link>
        
                <Link
          href={activeCamp ? `/camp/${activeCamp.id}/tennis` : '/camp/loading/tennis'}
          className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/tennis') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
                >
          Tennis program
                </Link>
        <Link
          href={activeCamp ? `/camp/${activeCamp.id}/schedule` : '/camp/loading/schedule'}
          className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/schedule') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
        >
          Schedule
        </Link>
                <Link
          href={activeCamp ? `/camp/${activeCamp.id}/essentials` : '/camp/loading/essentials'}
          className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/essentials') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
                >
          Essentials guide
                </Link>
        {/* Always render accommodation slot to prevent layout shift */}
        {hasAccommodation ? (
                  <Link
                    href={`/camp/${activeCamp.id}/stay`}
            className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/stay') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
                  >
            Accommodation
                  </Link>
        ) : (
          <div className="px-4 py-2 text-gray-400 cursor-not-allowed">
            Accommodation
          </div>
        )}
      </>
    );
  };

  const renderCoachNav = () => (
    <>
      <Link
        href="/home"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        Home
      </Link>
      <Link
        href="/coach/players"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/coach/players') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        Players
      </Link>
      <Link
        href="/coach/camps"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/coach/camps') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        Camps
      </Link>
    </>
  );

  const renderAdminNav = () => (
    <>
      <Link
        href="/home"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        Home
      </Link>
      <Link
        href="/admin/users"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/admin/users') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        User Management
      </Link>
      <Link
        href="/admin/camps"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/admin/camps') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        Camp Management
      </Link>
      <Link
        href="/admin/feedback"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/admin/feedback') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        Feedback
      </Link>
      <Link
        href="/cancellation-policy"
        className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/cancellation-policy') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
      >
        Cancellation Policy
      </Link>
    </>
  );

  // Always render the same navbar structure to prevent layout shifts
  const renderNavigation = () => {
    if (!user) {
      // Show placeholder navigation items with same dimensions
      return (
        <>
          <div className="px-4 py-2 text-gray-400">Home</div>
          <div className="px-4 py-2 text-gray-400">Tennis program</div>
          <div className="px-4 py-2 text-gray-400">Schedule</div>
          <div className="px-4 py-2 text-gray-400">Essentials guide</div>
          <div className="px-4 py-2 text-gray-400">Accommodation</div>
        </>
      );
    }

    if (user.role === 'player') {
      return renderPlayerNav();
    } else if (user.role === 'coach') {
      return renderCoachNav();
    } else if (user.role === 'admin') {
      return renderAdminNav();
    }

    return null;
  };

  const renderMobileNavigation = () => {
    if (!user) {
      // Show placeholder mobile navigation items with same dimensions
      return (
        <>
          <div className="px-4 py-3 text-gray-400">Home</div>
          <div className="px-4 py-3 text-gray-400">Tennis program</div>
          <div className="px-4 py-3 text-gray-400">Schedule</div>
          <div className="px-4 py-3 text-gray-400">Essentials guide</div>
          <div className="px-4 py-3 text-gray-400">Accommodation</div>
        </>
      );
    }

    if (user.role === 'player') {
      const activeCamp = camps[0];
      const hasAccommodation = activeCamp && activeCamp.package !== 'tennis_only';
      
      return (
        <>
          <Link
            href="/home"
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href={activeCamp ? `/camp/${activeCamp.id}/tennis` : '/camp/loading/tennis'}
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/tennis') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Tennis program
          </Link>
          <Link
            href={activeCamp ? `/camp/${activeCamp.id}/schedule` : '/camp/loading/schedule'}
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/schedule') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Schedule
          </Link>
          <Link
            href={activeCamp ? `/camp/${activeCamp.id}/essentials` : '/camp/loading/essentials'}
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/essentials') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Essentials guide
          </Link>
          {/* Always render accommodation slot to prevent layout shift */}
          {hasAccommodation ? (
            <Link
              href={`/camp/${activeCamp.id}/stay`}
              className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/stay') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Accommodation
            </Link>
          ) : (
            <div className="px-4 py-3 text-gray-400 cursor-not-allowed">
              Accommodation
            </div>
          )}
        </>
      );
    } else if (user.role === 'coach') {
      return (
        <>
          <Link
            href="/home"
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/coach/players"
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/coach/players') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Players
          </Link>
        </>
      );
    } else if (user.role === 'admin') {
      return (
        <>
          <Link
            href="/home"
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/admin/users"
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/admin/users') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            User Management
          </Link>
          <Link
            href="/admin/camps"
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/admin/camps') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Camp Management
          </Link>
          <Link
            href="/cancellation-policy"
            className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/cancellation-policy') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Cancellation Policy
          </Link>
        </>
      );
    }

    return null;
  };

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/home" className="text-xl md:text-2xl font-bold text-[#FF4C4C] cursor-pointer">
            Tennis Camp Connect
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {renderNavigation()}
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
            className="md:hidden p-2 text-gray-700 hover:text-[#FF4C4C] transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white absolute top-full left-0 right-0 z-50 shadow-lg">
            <div className="flex flex-col gap-1">
              {user && user.role === 'player' && (
                <>
                  <Link
                    href="/home"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                      <Link
                    href={camps[0] ? `/camp/${camps[0].id}/tennis` : '/camp/loading/tennis'}
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/tennis') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                    Tennis program
                      </Link>
                  <Link
                    href={camps[0] ? `/camp/${camps[0].id}/schedule` : '/camp/loading/schedule'}
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/schedule') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Schedule
                  </Link>
                      <Link
                    href={camps[0] ? `/camp/${camps[0].id}/essentials` : '/camp/loading/essentials'}
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/essentials') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                    Essentials guide
                      </Link>
                  {camps[0] && camps[0].package !== 'tennis_only' && (
                        <Link
                          href={`/camp/${camps[0].id}/stay`}
                      className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/stay') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                      Accommodation
                      </Link>
                  )}
                </>
              )}
              {user && user.role === 'coach' && (
                <>
                  <Link
                    href="/home"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/coach/players"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/coach/players') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Players
                  </Link>
                  <Link
                    href="/coach/camps"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/coach/camps') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Camps
                  </Link>
                </>
              )}
              {user && user.role === 'admin' && (
                <>
                  <Link
                    href="/home"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/home') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/admin/users') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    User Management
                  </Link>
                  <Link
                    href="/admin/camps"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/admin/camps') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Camp Management
                  </Link>
                  <Link
                    href="/admin/feedback"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/admin/feedback') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Feedback
                  </Link>
                  <Link
                    href="/cancellation-policy"
                    className={`px-4 py-3 hover:bg-gray-50 rounded transition-colors cursor-pointer ${isActive('/cancellation-policy') ? 'text-[#2563EB] font-semibold bg-blue-50' : 'text-gray-700'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cancellation Policy
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-3 hover:bg-gray-50 rounded text-left flex items-center gap-2 text-gray-700 transition-colors cursor-pointer"
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

