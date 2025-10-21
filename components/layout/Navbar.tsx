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
        {hasAccommodation && (
          <Link
            href={`/camp/${activeCamp.id}/stay`}
            className={`px-4 py-2 transition-colors cursor-pointer ${isActive('/stay') ? 'text-[#2563EB] font-semibold' : 'text-gray-700 hover:text-[#2563EB]'}`}
          >
            Accommodation
          </Link>
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
    </>
  );

  if (!user) {
    return (
      <nav className="navbar sticky top-0 z-50">
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/home" className="text-xl md:text-2xl font-bold text-[#66B032] cursor-pointer">
              Tennis Camp Connect
            </Link>

            {/* Loading state for navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/home"
                className="px-4 py-2 transition-colors cursor-pointer text-gray-700 hover:text-[#2563EB]"
              >
                Home
              </Link>
              <Link
                href="/camp/loading/tennis"
                className="px-4 py-2 transition-colors cursor-pointer text-gray-700 hover:text-[#2563EB]"
              >
                Tennis program
              </Link>
              <Link
                href="/camp/loading/schedule"
                className="px-4 py-2 transition-colors cursor-pointer text-gray-700 hover:text-[#2563EB]"
              >
                Schedule
              </Link>
              <Link
                href="/camp/loading/essentials"
                className="px-4 py-2 transition-colors cursor-pointer text-gray-700 hover:text-[#2563EB]"
              >
                Essentials guide
              </Link>
              <Link
                href="/camp/loading/stay"
                className="px-4 py-2 transition-colors cursor-pointer text-gray-700 hover:text-[#2563EB]"
              >
                Accommodation
              </Link>
            </div>

            {/* Loading state for logout */}
            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 text-gray-400">Loading...</div>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-[#FF4C4C] transition-colors cursor-pointer"
              disabled
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/home" className="text-xl md:text-2xl font-bold text-[#66B032] cursor-pointer">
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
              {user.role === 'player' && (
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
              {user.role === 'coach' && (
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
              )}
              {user.role === 'admin' && (
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

