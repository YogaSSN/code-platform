import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { LocalStorageRepository } from '../services/repository';
import { Trophy, Medal, Award } from 'lucide-react';

const realisticNames = ["Arun", "Karthik", "Dhanu", "Nivetha", "Pradeep", "Akash", "Rithika", "Sanjay", "Sneha", "Vikram"];

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch from repository
    const loadUsers = async () => {
      await new Promise(r => setTimeout(r, 400));
      const repo = new LocalStorageRepository<User>('leetcode-clone-users');
      // Sort by rating descending
      const sorted = repo.getAll().sort((a, b) => b.contestRating - a.contestRating);
      
      // If empty, generate some mock users just to show something
      if (sorted.length === 0) {
        const mockUsers: User[] = Array.from({length: 10}).map((_, i) => ({
          id: `mock-${i}`,
          username: realisticNames[i % realisticNames.length],
          email: `student${i}@example.com`,
          role: 'STUDENT' as const,
          createdAt: new Date().toISOString(),
          solvedProblems: Array.from({length: Math.floor(Math.random() * 50) + 10}).map(() => 'x'),
          contestRating: 1400 + Math.floor(Math.random() * 800),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${realisticNames[i % realisticNames.length]}`
        })).sort((a, b) => b.contestRating - a.contestRating);
        setUsers(mockUsers);
      } else {
        setUsers(sorted);
      }
      setLoading(false);
    };
    loadUsers();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading leaderboard...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Global Leaderboard</h1>
        <p className="text-muted-foreground">Compete with your classmates. Solve problems to climb the ranks.</p>
      </header>

      <div className="bg-card border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="py-3 px-4 font-semibold text-muted-foreground w-24 text-center">Rank</th>
              <th className="py-3 px-4 font-semibold text-muted-foreground">User</th>
                <th className="py-3 px-4 font-semibold text-muted-foreground text-right">Problems Solved</th>
                <th className="py-3 px-4 font-semibold text-muted-foreground text-right w-40">Rating</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const isTop3 = index < 3;
                return (
                  <tr 
                    key={user.id} 
                    className="border-b border-border hover:bg-secondary/40 transition-colors"
                  >
                    <td className="py-3 px-4 text-center">
                      {index === 0 && <Trophy className="w-6 h-6 text-yellow-500 mx-auto" />}
                      {index === 1 && <Medal className="w-6 h-6 text-slate-400 mx-auto" />}
                      {index === 2 && <Award className="w-6 h-6 text-amber-600 mx-auto" />}
                      {index > 2 && <span className="text-lg font-medium text-muted-foreground">{index + 1}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        </div>
                        <span className={`font-semibold ${isTop3 ? 'text-foreground' : 'text-foreground/90'}`}>{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-foreground/80">
                      {user.solvedProblems.length}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-primary">
                        {user.contestRating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
