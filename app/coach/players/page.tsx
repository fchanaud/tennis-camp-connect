'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AppLayout } from '@/components/layout/AppLayout';
import { User } from '@/types';
import { Eye } from 'lucide-react';

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
    let filtered = players;
    
    if (searchTerm.trim()) {
      filtered = players.filter(player => 
        `${player.first_name} ${player.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort players by their upcoming camp dates
    const sortedPlayers = filtered.sort((a, b) => {
      const now = new Date();
      
      // Get the next upcoming camp for each player
      const getNextUpcomingCamp = (player: PlayerWithCamp) => {
        const upcomingCamps = player.camps.filter(camp => new Date(camp.start_date) >= now);
        return upcomingCamps.length > 0 ? upcomingCamps[0] : null;
      };
      
      const nextCampA = getNextUpcomingCamp(a);
      const nextCampB = getNextUpcomingCamp(b);
      
      // Debug logging
      if (a.first_name === 'Andre' || a.first_name === 'Augustin' || b.first_name === 'Andre' || b.first_name === 'Augustin') {
        console.log(`Sorting: ${a.first_name} vs ${b.first_name}`);
        console.log(`${a.first_name} camps:`, a.camps.map(c => ({ start: c.start_date, end: c.end_date })));
        console.log(`${b.first_name} camps:`, b.camps.map(c => ({ start: c.start_date, end: c.end_date })));
        console.log(`${a.first_name} next upcoming:`, nextCampA?.start_date);
        console.log(`${b.first_name} next upcoming:`, nextCampB?.start_date);
      }
      
      // If both players have upcoming camps, sort by start date
      if (nextCampA && nextCampB) {
        const result = new Date(nextCampA.start_date).getTime() - new Date(nextCampB.start_date).getTime();
        console.log(`Both have upcoming camps: ${a.first_name} (${nextCampA.start_date}) vs ${b.first_name} (${nextCampB.start_date}) = ${result}`);
        return result;
      }
      
      // If only one has upcoming camps, prioritize that one
      if (nextCampA && !nextCampB) return -1;
      if (!nextCampA && nextCampB) return 1;
      
      // If neither has upcoming camps, sort by their most recent camp
      const getMostRecentCamp = (player: PlayerWithCamp) => {
        if (player.camps.length === 0) return null;
        return player.camps.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0];
      };
      
      const recentCampA = getMostRecentCamp(a);
      const recentCampB = getMostRecentCamp(b);
      
      if (recentCampA && recentCampB) {
        return new Date(recentCampB.start_date).getTime() - new Date(recentCampA.start_date).getTime();
      }
      
      if (recentCampA && !recentCampB) return -1;
      if (!recentCampA && recentCampB) return 1;
      
      // If no camps at all, sort alphabetically by name
      return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
    });
    
    console.log('Final sorted players:', sortedPlayers.map(p => ({ 
      name: `${p.first_name} ${p.last_name}`, 
      camps: p.camps.map(c => ({ start: c.start_date, end: c.end_date }))
    })));
    
    setFilteredPlayers(sortedPlayers);
  }, [searchTerm, players]);

  const loadPlayers = async () => {
    try {
      const response = await fetch('/api/coach/players');
      const data = await response.json();

      if (response.ok) {
        console.log('Loaded players:', data.players.map(p => ({ 
          name: `${p.first_name} ${p.last_name}`, 
          camps: p.camps.map(c => ({ start: c.start_date, end: c.end_date }))
        })));
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

  // Generate a unique key for each camp based on dates
  const getCampKey = (camp: CampInfo): string => {
    return `${camp.start_date}_${camp.end_date}`;
  };

  // Find how many players are in the same camp
  const getPlayersInSameCamp = (camp: CampInfo): string[] => {
    const campKey = getCampKey(camp);
    return filteredPlayers
      .filter(p => p.camps.some((c: CampInfo) => getCampKey(c) === campKey))
      .map(p => `${p.first_name} ${p.last_name}`);
  };

  // Check if multiple players share this camp
  const isSharedCamp = (camp: CampInfo): boolean => {
    return getPlayersInSameCamp(camp).length > 1;
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
                          <div className="text-xs text-gray-500 mb-1">Assessment</div>
                          <Badge variant={player.assessment_count > 0 ? 'success' : 'secondary'} className="text-xs px-2 py-1">
                            {player.assessment_count > 0 ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Reports</div>
                          <Badge variant={player.report_count > 0 ? 'success' : 'secondary'} className="text-xs px-2 py-1">
                            {player.report_count > 0 ? 'Yes' : 'No'}
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
                          {player.camps.map((camp, idx) => {
                            const playersInCamp = getPlayersInSameCamp(camp);
                            const isShared = isSharedCamp(camp);
                            
                            return (
                              <div 
                                key={idx} 
                                className={`p-3 rounded-lg border-2 ${
                                  isShared 
                                    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300' 
                                    : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                                }`}
                              >
                                <div className="flex flex-col gap-2">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900 mb-1">
                                      {isShared && <span className="text-amber-600 mr-1">👥</span>}
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
                                  {isShared && (
                                    <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded border border-amber-200">
                                      <strong>Shared with:</strong> {playersInCamp.filter(name => name !== `${player.first_name} ${player.last_name}`).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 pt-3 border-t">
                      <Link href={`/coach/players/${player.id}`}>
                        <Button variant="primary" size="sm" fullWidth className="flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </Link>
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
                          <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
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
                                {player.assessment_count > 0 ? 'Yes' : 'No'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant={player.report_count > 0 ? 'success' : 'secondary'} className="text-sm px-3 py-1">
                                {player.report_count > 0 ? 'Yes' : 'No'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              {player.camps.length === 0 ? (
                                <div className="text-sm text-gray-400 italic">No camps assigned</div>
                              ) : (
                                <div className="space-y-2">
                                  {player.camps.map((camp, idx) => {
                                    const playersInCamp = getPlayersInSameCamp(camp);
                                    const isShared = isSharedCamp(camp);
                                    
                                    return (
                                      <div 
                                        key={idx} 
                                        className={`rounded-lg p-3 border-2 ${
                                          isShared 
                                            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300' 
                                            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                                        }`}
                                      >
                                        <div className="space-y-2">
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm mb-1.5">
                                              {isShared ? '👥' : '📅'} {new Date(camp.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(camp.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                                              {isShared && (
                                                <Badge variant="warning" className="text-xs">
                                                  {playersInCamp.length} players
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          {isShared && (
                                            <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1.5 rounded border border-amber-200">
                                              <strong>Also in this camp:</strong> {playersInCamp.filter(name => name !== `${player.first_name} ${player.last_name}`).join(', ')}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Link href={`/coach/players/${player.id}`}>
                                <Button variant="outline" size="sm" className="flex items-center justify-center gap-2 mx-auto">
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </Link>
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

