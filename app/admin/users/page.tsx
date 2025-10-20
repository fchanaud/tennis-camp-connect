'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Card, CardBody, CardTitle } from '@/components/ui/Card';
import { User } from '@/types';
import { AppLayout } from '@/components/layout/AppLayout';

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
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        console.error('Error loading users:', data.error);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setLoading(false);
  };

  const createUser = async (role: 'player' | 'coach') => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both first and last name');
      return;
    }

    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCredentials({ 
          username: data.user.username, 
          password: data.user.password 
        });
        setFirstName('');
        setLastName('');
        loadUsers();
      } else {
        setError(data.error || 'Failed to create user');
      }
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


  return (
    <AppLayout>
      <div className="p-8">
        <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">User Management</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="primary" onClick={() => setShowPlayerModal(true)} className="w-full sm:w-auto">
              Create New Player
            </Button>
            <Button variant="secondary" onClick={() => setShowCoachModal(true)} className="w-full sm:w-auto">
              Create New Coach
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex-1 sm:flex-none"
          >
            All Users
          </Button>
          <Button
            variant={filter === 'player' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('player')}
            className="flex-1 sm:flex-none"
          >
            Players
          </Button>
          <Button
            variant={filter === 'coach' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('coach')}
            className="flex-1 sm:flex-none"
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
              <table className="table table-striped table-hover w-full min-w-[600px]">
                <thead>
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left">Name</th>
                    <th className="px-3 sm:px-6 py-3 text-left">Username</th>
                    <th className="px-3 sm:px-6 py-3 text-left">Role</th>
                    <th className="px-3 sm:px-6 py-3 text-left">Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-3 sm:px-6 py-4 text-sm sm:text-base">
                        <div className="break-words">
                          {user.first_name} {user.last_name}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm sm:text-base">
                        <div className="break-words">{user.username}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4">
                        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'coach' ? 'info' : 'primary'} className="text-xs sm:text-sm">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm sm:text-base">
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
    </AppLayout>
  );
}

