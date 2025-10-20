'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/types';

interface CampInfo {
  id: string;
  start_date: string;
  end_date: string;
  package: string;
  coach_id: string | null;
}

interface PlayerWithCamp extends User {
  camps: CampInfo[];
  assessment_count: number;
  report_count: number;
}

export default function PlayersListPage() {
  const [players, setPlayers] = useState<PlayerWithCamp[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<PlayerWithCamp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = players.filter(player => 
        `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [searchTerm, players]);

  const loadPlayers = async () => {
    try {
      const response = await fetch('/api/coach/players');
      const data = await response.json();

      if (response.ok) {
        setPlayers(data.players || []);
        setFilteredPlayers(data.players || []);
      } else {
        console.error('Error loading players:', data.error);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    }
    setLoading(false);
  };

  const getPackageLabel = (pkg: string): string => {
    const labels: Record<string, string> = {
      'tennis_only': 'Tennis Only',
      'stay_and_play': 'Stay & Play',
      'luxury_stay_and_play': 'Luxury Stay & Play',
      'no_tennis': 'No Tennis'
    };
    return labels[pkg] || pkg;
  };

  const getCampStatus = (camp: CampInfo): 'upcoming' | 'in-progress' | 'completed' => {
    const now = new Date();
    const start = new Date(camp.start_date);
    const end = new Date(camp.end_date);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'in-progress';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-4 sm:p-8">
        <div className="container mx-auto text-center py-12">
          Loading players...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-4 sm:p-8">
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">All Players</h1>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <Input
            type="text"
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-full sm:max-w-md"
          />
        </div>

        {filteredPlayers.length === 0 ? (
          <Card>
            <CardBody className="text-center py-8 sm:py-12">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">No Players Found</h2>
              <p className="text-sm sm:text-base text-gray-600">
                {searchTerm ? 'No players match your search.' : 'No players in the system yet.'}
              </p>
            </CardBody>
          </Card>
        ) : (
          <>
            {/* Mobile View - Cards */}
            <div className="block lg:hidden space-y-4">
              {filteredPlayers.map((player) => (
                <Card key={player.id}>
                  <CardBody className="p-4">
                    <div className="space-y-3">
                      {/* Name */}
                      <div>
                        <h3 className="font-semibold text-lg break-words">
                          {player.first_name} {player.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">@{player.username}</p>
                      </div>

                      {/* Assessments */}
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-sm text-gray-600">Assessments:</span>
                        <Badge variant={player.assessment_count > 0 ? 'success' : 'secondary'} className="text-xs">
                          {player.assessment_count}
                        </Badge>
                      </div>

                      {/* Reports */}
                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-sm text-gray-600">Reports:</span>
                        <Badge variant={player.report_count > 0 ? 'success' : 'secondary'} className="text-xs">
                          {player.report_count}
                        </Badge>
                      </div>

                      {/* Assigned Camps */}
                      <div className="py-2 border-t">
                        <span className="text-sm text-gray-600 block mb-2">Assigned Camps:</span>
                        {player.camps.length === 0 ? (
                          <Badge variant="secondary" className="text-xs">No camps</Badge>
                        ) : (
                          <div className="space-y-2">
                            {player.camps.map((camp, idx) => (
                              <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                                <div className="font-medium mb-1">
                                  {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  <Badge variant="primary" className="text-xs">
                                    {getPackageLabel(camp.package)}
                                  </Badge>
                                  <Badge 
                                    variant={
                                      getCampStatus(camp) === 'upcoming' ? 'info' :
                                      getCampStatus(camp) === 'in-progress' ? 'warning' : 'secondary'
                                    }
                                    className="text-xs"
                                  >
                                    {getCampStatus(camp)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Card>
                <CardBody className="p-0">
                  <table className="table table-hover mb-0">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Assessments</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Reports</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned Camps</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.map((player) => (
                        <tr key={player.id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <span className="font-medium text-gray-900 break-words">
                              {player.first_name} {player.last_name}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-gray-600 text-sm">@{player.username}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge variant={player.assessment_count > 0 ? 'success' : 'secondary'} className="text-xs">
                              {player.assessment_count}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge variant={player.report_count > 0 ? 'success' : 'secondary'} className="text-xs">
                              {player.report_count}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            {player.camps.length === 0 ? (
                              <Badge variant="secondary" className="text-xs">No camps assigned</Badge>
                            ) : (
                              <div className="space-y-2">
                                {player.camps.map((camp, idx) => (
                                  <div key={idx} className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-gray-700 whitespace-nowrap">
                                      {new Date(camp.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(camp.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <Badge variant="primary" className="text-xs">
                                      {getPackageLabel(camp.package)}
                                    </Badge>
                                    <Badge 
                                      variant={
                                        getCampStatus(camp) === 'upcoming' ? 'info' :
                                        getCampStatus(camp) === 'in-progress' ? 'warning' : 'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {getCampStatus(camp)}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </div>

            {/* Summary */}
            <div className="mt-4 sm:mt-6 text-sm text-gray-600">
              Showing {filteredPlayers.length} {filteredPlayers.length === 1 ? 'player' : 'players'}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

