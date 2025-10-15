'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Hotel, 
  Package, 
  Users, 
  FileText,
  Settings,
  LogOut,
  Trophy,
  UserCog
} from 'lucide-react';
import { User, Camp } from '@/types';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  user: User | null;
  camps?: Camp[];
}

// Navigation item interface for role-based routing
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  showOnMobile?: boolean;
}

export function Navbar({ user, camps = [] }: NavbarProps) {
  const pathname = usePathname();
  const activeCamp = camps[0]; // Default to first camp for players

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      window.location.href = '/login';
    }
  };

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

  /**
   * Get role-based navigation items
   * Returns navigation items tailored to the user's role
   */
  const getNavigationItems = (): NavItem[] => {
    if (!user) return [];

    switch (user.role) {
      case 'player':
        // Player navigation - context-aware based on camp enrollment
        const playerNav: NavItem[] = [
          { label: 'Home', href: '/home', icon: Home, showOnMobile: true }
        ];
        
        if (activeCamp) {
          playerNav.push(
            { label: 'Tennis', href: `/camp/${activeCamp.id}/tennis`, icon: Trophy, showOnMobile: true },
            { label: 'Schedule', href: `/camp/${activeCamp.id}/schedule`, icon: Calendar, showOnMobile: true },
            { label: 'Essentials', href: `/camp/${activeCamp.id}/essentials`, icon: Package, showOnMobile: true }
          );
          
          // Add Stay navigation only for relevant packages
          if (['stay_and_play', 'luxury_stay_and_play', 'no_tennis'].includes(activeCamp.package)) {
            playerNav.splice(3, 0, { 
              label: 'Stay', 
              href: `/camp/${activeCamp.id}/stay`, 
              icon: Hotel, 
              showOnMobile: true 
            });
          }
        }
        
        return playerNav;

      case 'coach':
        // Coach navigation - focused on player management and reports
        return [
          { label: 'Home', href: '/home', icon: Home, showOnMobile: true },
          { label: 'Players', href: '/coach/players', icon: Users, showOnMobile: true },
          { label: 'Reports', href: '/coach/players', icon: FileText, showOnMobile: true }
        ];

      case 'admin':
        // Admin navigation - system management tools
        return [
          { label: 'Home', href: '/home', icon: Home, showOnMobile: true },
          { label: 'Users', href: '/admin/users', icon: UserCog, showOnMobile: true },
          { label: 'Camps', href: '/admin/camps', icon: Settings, showOnMobile: true }
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  if (!user) return null;

  return (
    <>
      {/* 
        ========================================
        TOP NAVIGATION BAR - Tablet & Desktop
        ========================================
        Visible on screens >= 768px (md breakpoint)
        Displays text labels only, no icons
      */}
      <nav className="hidden md:block navbar sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Red Logo - Always Visible */}
            <Link href="/home" className="text-2xl font-bold text-[#FF0000] hover:text-[#CC0000] transition-colors">
              Tennis Camp Connect
            </Link>

            {/* Navigation Links - Text Only */}
            <div className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-[#FF0000] bg-red-50'
                      : 'text-gray-700 hover:text-[#FF0000] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 
        ========================================
        MOBILE TOP BAR - Logo Only
        ========================================
        Visible on mobile screens < 768px
        Shows only the red logo
      */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-center h-14 px-4">
          <Link href="/home" className="text-xl font-bold text-[#FF0000]">
            Tennis Camp Connect
          </Link>
        </div>
      </div>

      {/* 
        ========================================
        BOTTOM NAVIGATION BAR - Mobile Only
        ========================================
        Visible on screens < 768px (mobile)
        Fixed to bottom of viewport with icons only
        Role-based navigation items
        Follows iOS/Android native app patterns
      */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems
            .filter((item) => item.showOnMobile)
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center flex-1 h-full min-w-0 transition-colors"
                  aria-label={item.label}
                >
                  <div className={`flex flex-col items-center justify-center gap-1 ${
                    active ? 'text-[#FF0000]' : 'text-gray-600'
                  }`}>
                    {/* Icon - 44x44px touch target */}
                    <div className="w-11 h-11 flex items-center justify-center">
                      <Icon 
                        className={`transition-all ${
                          active ? 'w-7 h-7' : 'w-6 h-6'
                        }`}
                        strokeWidth={active ? 2.5 : 2}
                      />
                    </div>
                    {/* Optional tiny label for context - only show on active */}
                    {active && (
                      <span className="text-[10px] font-semibold truncate max-w-full">
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          
          {/* Logout Button - Mobile */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center flex-1 h-full min-w-0 transition-colors"
            aria-label="Logout"
          >
            <div className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-[#FF0000]">
              <div className="w-11 h-11 flex items-center justify-center">
                <LogOut className="w-6 h-6" strokeWidth={2} />
              </div>
            </div>
          </button>
        </div>
      </nav>

      {/* Spacer for mobile bottom navigation - prevents content from being hidden */}
      <div className="md:hidden h-16" aria-hidden="true" />
    </>
  );
}

