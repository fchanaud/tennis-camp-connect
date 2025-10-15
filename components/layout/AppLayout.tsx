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

  useEffect(() => {
    // Check for user in sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Load camps for players (you can extend this logic later)
        if (userData.role === 'player') {
          // For now, set empty camps array
          // In the future, you can fetch actual camps from the API
          setCamps([]);
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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
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
