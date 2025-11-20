import React, { useMemo } from 'react';
import { Student, Team } from '../types';

interface TeamLeaderboardProps {
  students: Student[];
  teams: Team[];
  sortBy: 'total_exp' | 'total_points';
  unit: '经验' | '积分';
}

const barColor = (rank: number): string => {
  if (rank === 0) return 'bg-yellow-400';
  if (rank === 1) return 'bg-gray-400';
  if (rank === 2) return 'bg-orange-500';
  return 'bg-cyan-400';
}

const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({ students, teams, sortBy, unit }) => {
  const rankedTeams = useMemo(() => {
    const teamScores = new Map<string, number>();
    teams.forEach(team => teamScores.set(team.id, 0));

    students.forEach(student => {
      const currentScore = teamScores.get(student.team_id) || 0;
      teamScores.set(student.team_id, currentScore + student[sortBy]);
    });

    const sortedTeams = Array.from(teamScores.entries())
      .map(([teamId, totalScore]) => ({
        team: teams.find(t => t.id === teamId),
        totalScore,
      }))
      .filter((item): item is { team: Team, totalScore: number } => !!item.team)
      .sort((a, b) => b.totalScore - a.totalScore);

    return sortedTeams;
  }, [students, teams, sortBy]);

  const max = rankedTeams.length ? rankedTeams[0].totalScore : 1
  return (
    <div className="space-y-3">
      {rankedTeams.map(({ team, totalScore }, index) => (
        <div key={team.id} className="flex items-center gap-3">
          <span className="w-6 text-center text-sm text-slate-400">{index + 1}</span>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-semibold ${team.textColor}`}>{team.name}</span>
              <span className="text-xs text-slate-400">{totalScore.toLocaleString()} {unit}</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full">
              <div className={`h-2 rounded-full ${barColor(index)}`} style={{ width: `${Math.max(5, Math.round(totalScore / max * 100))}%` }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamLeaderboard;