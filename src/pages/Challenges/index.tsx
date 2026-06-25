import React from 'react';
import { Link } from 'react-router-dom';
import { Swords, Plus, LogIn, History, Trophy, Flame, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useActiveSession } from '../../hooks/useActiveSession';

const ChallengesLanding: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const wins = user?.challengeWins || 0;
  const losses = user?.challengeLosses || 0;
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  
  const { activeChallenge, sessionType } = useActiveSession();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
          <Swords className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">1 vs 1 Challenge</h1>
          <p className="text-muted-foreground mt-1">Compete head-to-head in real-time coding duels.</p>
        </div>
      </div>

      {sessionType === 'CHALLENGE' && activeChallenge && (
        <div className="bg-card border border-border rounded-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <div className="text-sm font-bold text-orange-500 tracking-widest uppercase mb-1">Current Active Challenge</div>
            <h2 className="text-2xl font-bold text-foreground">{activeChallenge.challengeName}</h2>
            <p className="text-muted-foreground mt-2">Opponent: {activeChallenge.player1Id === user?.id ? (activeChallenge.player2Id ? "Connected" : "Waiting for Opponent") : "Host"}</p>
          </div>
          <div className="flex items-center gap-6">
            <Link to={`/challenges/${activeChallenge.id}`} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-all flex items-center gap-2">
              Resume <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/challenges/create"
            className="group relative overflow-hidden bg-card border border-border rounded-md p-6 hover:bg-secondary/50 transition-all flex flex-col"
          >
            
            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-4 relative z-10">
              <Plus className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-bold mb-2 relative z-10 group-hover:text-orange-500 transition-colors">Create Challenge</h2>
            <p className="text-muted-foreground text-sm relative z-10">
              Host a new duel. Choose difficulty and duration, then invite a friend.
            </p>
          </Link>

          <Link
            to="/challenges/join"
            className="group relative overflow-hidden bg-card border border-border rounded-md p-6 hover:bg-secondary/50 transition-all flex flex-col"
          >
            
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 relative z-10">
              <LogIn className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-bold mb-2 relative z-10 group-hover:text-primary transition-colors">Join Challenge</h2>
            <p className="text-muted-foreground text-sm relative z-10">
              Have an invite code? Enter it here to join an existing duel.
            </p>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-md p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold">Your Stats</h2>
          </div>
          
          <div className="space-y-4 flex-grow">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <span className="font-bold">{winRate}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${winRate}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-card border border-border rounded-md p-3 text-center">
                <div className="text-2xl font-bold text-green-500">{wins}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Wins</div>
              </div>
              <div className="bg-card border border-border rounded-md p-3 text-center">
                <div className="text-2xl font-bold text-red-500">{losses}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Losses</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" /> Current Streak
              </span>
              <span className="font-bold">{user?.currentWinStreak || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link 
          to="/challenges/history"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 bg-secondary/50 rounded-lg"
        >
          <History className="w-4 h-4" /> View Match History
        </Link>
      </div>
    </div>
  );
};

export default ChallengesLanding;
