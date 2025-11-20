import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Header from './components/Header'
import LeaderboardCard from './components/LeaderboardCard'
import StudentLeaderboard from './components/StudentLeaderboard'
import TeamLeaderboard from './components/TeamLeaderboard'
import TeamTicker from './components/TeamTicker'
import ChallengeArenaCard from './components/ChallengeArenaCard'
import HonorBadgesCard from './components/HonorBadgesCard'
import PKBoardCard from './components/PKBoardCard'
import { Student, Team, Challenge } from './types'
import { getStudents, getTeams, getChallenges, getBadges, getPKs, getRecentTasks } from './services/sealosService'

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [pks, setPks] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getTeams(), getStudents(), getChallenges(), getPKs(7), getRecentTasks(7)]).then(([t, s, c, p, tk]) => {
      setTeams(t)
      setStudents(s)
      setChallenges(c)
      setPks(p)
      setTasks(tk)
    })
  }, [])

  const teamsMap = useMemo(() => new Map<string, Team>(teams.map(t => [t.id, t])), [teams])
  const sortedByExp = useMemo(() => [...students].sort((a, b) => b.total_exp - a.total_exp), [students])

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-4 flex flex-col overflow-hidden">
      <Header />
      <main className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
        <div className="lg:col-span-2 h-full min-h-0">
          <LeaderboardCard title="等级大厅" rightSlot={<TeamTicker students={students} teams={teams} sortBy="total_exp" unit="经验" />}>
            <StudentLeaderboard students={sortedByExp} teamsMap={teamsMap} onAvatarChange={() => {}} />
          </LeaderboardCard>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
          <div className="flex-shrink-0">
            <PKBoardCard pks={pks} teamsMap={teamsMap} />
          </div>
          <div className="flex-grow min-h-0">
            <ChallengeArenaCard challenges={challenges} />
          </div>
        </div>
      </main>
      <div className="mt-4 grid grid-cols-1 gap-6 flex-shrink-0">
        <div className="col-span-1">
          <HonorBadgesCard students={students} />
        </div>
      </div>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)