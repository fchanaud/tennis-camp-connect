'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardTitle, CardText } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';

interface PlayerWithCamp extends User {
  camps?: any[];
  assessment_status?: string;
  report_status?: string;
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
    const supabase = createClient();
    
    // Get current user (coach)
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    // Get camps where this coach is assigned
    const { data: coachCamps } = await supabase
      .from('camps')
      .select('id')
      .eq('coach_id', authUser.id);

    if (!coachCamps || coachCamps.length === 0) {
      setLoading(false);
      return;
    }

    const campIds = coachCamps.map(c => c.id);

    // Get all players in these camps
    const { data: campPlayers } = await supabase
      .from('camp_players')
      .select(`
        player_id,
        camps (
          id,
          start_date,
          end_date,
          package
        )
      `)
      .in('camp_id', campIds);

    if (!campPlayers) {
      setLoading(false);
      return;
    }

    // Get unique player IDs
    const playerIds = [...new Set(campPlayers.map(cp => cp.player_id))];

    // Get player details
    const { data: playersData } = await supabase
      .from('users')
      .select('*')
      .in('id', playerIds);

    // Get assessments and reports status for each player
    const playersWithStatus = await Promise.all(
      (playersData || []).map(async (player) => {
        const playerCamps = campPlayers
          .filter(cp => cp.player_id === player.id)
          .map(cp => cp.camps);

        // Check assessment status
        const { data: assessments } = await supabase
          .from('pre_camp_assessments')
          .select('id')
          .eq('player_id', player.id);

        // Check report status
        const { data: reports } = await supabase
          .from('post_camp_reports')
          .select('id')
          .eq('player_id', player.id);

        return {
          ...player,
          camps: playerCamps,
          assessment_status: assessments && assessments.length > 0 ? 'completed' : 'pending',
          report_status: reports && reports.length > 0 ? 'completed' : 'pending',
        };
      })
    );

    setPlayers(playersWithStatus);
    setFilteredPlayers(playersWithStatus);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] p-8">
        <div className="container mx-auto text-center py-12">
          Loading players...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Players</h1>

        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <Input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPlayers.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <CardTitle>No Players Found</CardTitle>
              <CardText>
                {searchTerm ? 'No players match your search.' : 'You have no assigned players yet.'}
              </CardText>
            </CardBody>
          </Card>
        ) : (
          <div className="row">
            {filteredPlayers.map((player) => (
              <div key={player.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <Card hover>
                  <CardBody>
                    <CardTitle className="mb-3">
                      {player.first_name} {player.last_name}
                    </CardTitle>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Assessment:</span>
                        <Badge variant={player.assessment_status === 'completed' ? 'success' : 'warning'}>
                          {player.assessment_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Report:</span>
                        <Badge variant={player.report_status === 'completed' ? 'success' : 'warning'}>
                          {player.report_status}
                        </Badge>
                      </div>
                    </div>

                    {player.camps && player.camps.length > 0 && (
                      <CardText className="text-sm mb-3">
                        Current Camp: {new Date(player.camps[0].start_date).toLocaleDateString()}
                      </CardText>
                    )}

                    <Link href={`/coach/players/${player.id}`}>
                      <Button variant="primary" size="sm" fullWidth>
                        View Details
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

