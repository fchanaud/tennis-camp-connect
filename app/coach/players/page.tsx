'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AppLayout } from '@/components/layout/AppLayout';
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
      <AppLayout>
        <div className="p-4 sm:p-8">
          <div className="container mx-auto text-center py-12">
            Loading players...
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-8">
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
            {/* Mobile & Tablet View - Cards */}
            <div className="block xl:hidden space-y-3">
              {filteredPlayers.map((player) => (
                <Card key={player.id} className="hover:shadow-md transition-shadow">
                  <CardBody className="p-4">
                    {/* Player Header */}
                    <div className="flex items-start justify-between mb-3 pb-3 border-b">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 break-words">
                          {player.first_name} {player.last_name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">@{player.username}</p>
                      </div>
                      <div className="flex gap-2 ml-3 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Assess.</div>
                          <Badge variant={player.assessment_count > 0 ? 'success' : 'secondary'} className="text-xs px-2 py-1">
                            {player.assessment_count}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Reports</div>
                          <Badge variant={player.report_count > 0 ? 'success' : 'secondary'} className="text-xs px-2 py-1">
                            {player.report_count}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Camps */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Camps ({player.camps.length})
                      </div>
                      {player.camps.length === 0 ? (
                        <div className="text-sm text-gray-400 italic">No camps assigned</div>
                      ) : (
                        <div className="space-y-2">
                          {player.camps.map((camp, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-3 rounded-lg">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-gray-900 mb-1">
                                    {new Date(camp.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(camp.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <div className="flex gap-1.5 flex-wrap">
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
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Desktop View - Enhanced Table */}
            <div className="hidden xl:block">
              <Card>
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Player</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Assessments</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Reports</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned Camps</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredPlayers.map((player) => (
                          <tr key={player.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-semibold text-gray-900 text-base">
                                  {player.first_name} {player.last_name}
                                </div>
                                <div className="text-sm text-gray-500">@{player.username}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant={player.assessment_count > 0 ? 'success' : 'secondary'} className="text-sm px-3 py-1">
                                {player.assessment_count}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant={player.report_count > 0 ? 'success' : 'secondary'} className="text-sm px-3 py-1">
                                {player.report_count}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              {player.camps.length === 0 ? (
                                <div className="text-sm text-gray-400 italic">No camps assigned</div>
                              ) : (
                                <div className="space-y-2">
                                  {player.camps.map((camp, idx) => (
                                    <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900 text-sm mb-1.5">
                                            📅 {new Date(camp.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(camp.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
    </AppLayout>
  );
}

