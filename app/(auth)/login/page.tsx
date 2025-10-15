'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Temporary hardcoded users for testing
      const testUsers = {
        'admin': { id: '11111111-1111-1111-1111-111111111111', first_name: 'System', last_name: 'Administrator', username: 'admin', role: 'admin' },
        'coach': { id: '22222222-2222-2222-2222-222222222222', first_name: 'Rafael', last_name: 'Nadal', username: 'coach', role: 'coach' },
        'jdoe': { id: '33333333-3333-3333-3333-333333333333', first_name: 'John', last_name: 'Doe', username: 'jdoe', role: 'player' }
      };

      const user = testUsers[username.toLowerCase() as keyof typeof testUsers];

      if (!user) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Accept any password for testing
      if (password.length < 3) {
        setError('Password must be at least 3 characters');
        setLoading(false);
        return;
      }

      // Store user info in sessionStorage for temporary auth
      sessionStorage.setItem('user', JSON.stringify(user));
      
      router.push('/home');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="card-body p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#FF4C4C] mb-2">Tennis Camp Connect</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

