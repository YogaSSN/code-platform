import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, Trophy, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import { RootState } from '../../store';
import { challengeService } from '../../services/challenges';
import { Challenge } from '../../types';
import { problemService } from '../../services/problems';
import { authService } from '../../services/auth';

interface HistoryItem {
  challenge: Challenge;
  problemName: string;
  opponentName: string;
}

const ChallengeHistory: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const challenges = await challengeService.getHistory(user.id);
        const problems = await problemService.getProblems();
        
        const detailedHistory = await Promise.all(challenges.map(async (c) => {
          const prob = problems.find(p => p.id === c.problemId);
          const oppId = c.player1Id === user.id ? c.player2Id : c.player1Id;
          let oppName = 'Unknown';
          if (oppId) {
            const opp = await authService.getUser(oppId);
            if (opp) oppName = opp.username;
          }
          return {
            challenge: c,
            problemName: prob?.title || 'Unknown Problem',
            opponentName: oppName
          };
        }));
        
        setHistory(detailedHistory);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading history...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button 
        onClick={() => navigate('/challenges')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Challenges
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Match History</h1>
          <p className="text-muted-foreground mt-1">Review your past 1v1 duels.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {history.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            You haven't completed any challenges yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground text-sm border-b border-border">
                  <th className="py-4 px-6 font-medium">Result</th>
                  <th className="py-4 px-6 font-medium">Opponent</th>
                  <th className="py-4 px-6 font-medium">Problem</th>
                  <th className="py-4 px-6 font-medium">Duration</th>
                  <th className="py-4 px-6 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => {
                  const iWon = item.challenge.winnerId === user?.id;
                  
                  return (
                    <tr key={item.challenge.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-6">
                        {iWon ? (
                          <div className="flex items-center gap-2 text-green-500 font-bold">
                            <CheckCircle2 className="w-4 h-4" /> WON
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-500 font-bold">
                            <XCircle className="w-4 h-4" /> LOST
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium">vs {item.opponentName}</td>
                      <td className="py-4 px-6 text-orange-500">{item.problemName}</td>
                      <td className="py-4 px-6 flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" /> {item.challenge.duration / 60000} Min
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(item.challenge.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeHistory;
