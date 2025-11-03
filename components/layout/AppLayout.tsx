'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from './Navbar';
import { Spinner } from '@/components/ui/Spinner';
import { User } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [camps, setCamps] = useState<any[]>([]);
  const router = useRouter();

  const loadPlayerCamps = async (userId: string) => {
    try {
      const response = await fetch(`/api/player/camps?userId=${userId}`);
      
      if (!response.ok) {
        // Silently handle errors - don't log to console
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setCamps(data.camps || []);
    } catch (error) {
      // Silently handle errors - don't log to console
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check for user in sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Load camps for players
        if (userData.role === 'player') {
          loadPlayerCamps(userData.id);
        } else {
          setLoading(false);
        }
      } catch {
        sessionStorage.removeItem('user');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <Navbar user={user} camps={camps} />
        <main>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <Navbar user={null} camps={[]} />
        <main>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Redirecting to login...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar user={user} camps={camps} />
      <main>
        {children}
      </main>
    </div>
  );
}
