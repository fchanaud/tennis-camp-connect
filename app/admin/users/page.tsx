'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { generateUsername, generateRandomPassword } from '@/lib/utils/password-generator';
import { User } from '@/types';
import { createClient } from '@/lib/supabase/client';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState<{ username: string; password: string } | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'player' | 'coach'>('all');
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setUsers(data);
    setLoading(false);
  };

  const createUser = async (role: 'player' | 'coach') => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both first and last name');
      return;
    }

    setError('');
    const username = generateUsername(firstName, lastName);
    const password = generateRandomPassword(username);

    try {
      const supabase = createClient();

      // Create auth user with email format: userId@tenniscamp.local
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${username}@tenniscamp.local`,
        password: password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          username: username,
          role: role,
        });

      if (userError) throw userError;

      setGeneratedCredentials({ username, password });
      setFirstName('');
      setLastName('');
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  const closeModal = () => {
    setShowPlayerModal(false);
    setShowCoachModal(false);
    setFirstName('');
    setLastName('');
    setGeneratedCredentials(null);
    setError('');
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  const usernamePreview = firstName && lastName ? generateUsername(firstName, lastName) : '';

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">User Management</h1>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setShowPlayerModal(true)}>
              Create New Player
            </Button>
            <Button variant="secondary" onClick={() => setShowCoachModal(true)}>
              Create New Coach
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Users
          </Button>
          <Button
            variant={filter === 'player' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('player')}
          >
            Players
          </Button>
          <Button
            variant={filter === 'coach' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('coach')}
          >
            Coaches
          </Button>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'coach' ? 'info' : 'primary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Create Player Modal */}
      {showPlayerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardBody className="p-6">
              <CardTitle className="mb-4">Create New Player</CardTitle>
              
              {generatedCredentials ? (
                <div>
                  <Alert variant="success" className="mb-4">
                    Player created successfully! Please save these credentials:
                  </Alert>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold mb-2">Username: {generatedCredentials.username}</p>
                    <p className="font-semibold">Password: {generatedCredentials.password}</p>
                  </div>
                  <Alert variant="warning">
                    This password will only be shown once. Make sure to save it!
                  </Alert>
                  <Button variant="primary" fullWidth onClick={closeModal} className="mt-4">
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                  
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="mb-3"
                  />
                  
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="mb-3"
                  />
                  
                  {usernamePreview && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Username will be:</p>
                      <p className="font-semibold text-[#2563EB]">{usernamePreview}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button variant="outline" fullWidth onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button variant="primary" fullWidth onClick={() => createUser('player')}>
                      Create Player
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Create Coach Modal */}
      {showCoachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardBody className="p-6">
              <CardTitle className="mb-4">Create New Coach</CardTitle>
              
              {generatedCredentials ? (
                <div>
                  <Alert variant="success" className="mb-4">
                    Coach created successfully! Please save these credentials:
                  </Alert>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold mb-2">Username: {generatedCredentials.username}</p>
                    <p className="font-semibold">Password: {generatedCredentials.password}</p>
                  </div>
                  <Alert variant="warning">
                    This password will only be shown once. Make sure to save it!
                  </Alert>
                  <Button variant="primary" fullWidth onClick={closeModal} className="mt-4">
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                  
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="mb-3"
                  />
                  
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="mb-3"
                  />
                  
                  {usernamePreview && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Username will be:</p>
                      <p className="font-semibold text-[#2563EB]">{usernamePreview}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button variant="outline" fullWidth onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button variant="secondary" fullWidth onClick={() => createUser('coach')}>
                      Create Coach
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

