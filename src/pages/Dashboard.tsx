import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { problemService } from '../services/problems';
import { submissionService } from '../services/submissions';
import { Problem, Submission } from '../types';
import { Trophy, Code2, Target, Zap, Clock, Calendar, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      const [allProblems, userSubmissions] = await Promise.all([
        problemService.getProblems(),
        submissionService.getSubmissions(user.id)
      ]);
      setProblems(allProblems);
      setSubmissions(userSubmissions);
      setLoading(false);
    };
    loadData();
  }, [user]);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-32 bg-card rounded-2xl"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-card rounded-2xl"></div>
        <div className="h-48 bg-card rounded-2xl"></div>
        <div className="h-48 bg-card rounded-2xl"></div>
      </div>
    </div>;
  }

  const solvedSet = new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId));
  const easySolved = problems.filter(p => p.difficulty === 'Easy' && solvedSet.has(p.id)).length;
  const mediumSolved = problems.filter(p => p.difficulty === 'Medium' && solvedSet.has(p.id)).length;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard' && solvedSet.has(p.id)).length;
  
  const totalEasy = problems.filter(p => p.difficulty === 'Easy').length;
  const totalMedium = problems.filter(p => p.difficulty === 'Medium').length;
  const totalHard = problems.filter(p => p.difficulty === 'Hard').length;

  return (
    <div className="space-y-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.username}! Here's your progress.</p>
        </div>
      </header>

      {/* Daily Challenge Widget */}
      {problems.length > 0 && (() => {
        // Deterministic random problem based on current date
        const today = new Date().toISOString().split('T')[0];
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
          hash = ((hash << 5) - hash) + today.charCodeAt(i);
          hash |= 0;
        }
        const index = Math.abs(hash) % problems.length;
        const dailyProblem = problems[index];
        const isCompleted = solvedSet.has(dailyProblem.id);

        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/20 via-primary/5 to-background border border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Daily Challenge
                  {isCompleted && <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded font-medium tracking-wide">COMPLETED</span>}
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5"><span className="font-medium text-foreground">{dailyProblem.title}</span> • {dailyProblem.difficulty}</p>
              </div>
            </div>
            
            <Link 
              to={`/problems/${dailyProblem.slug}`}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${
                isCompleted 
                  ? 'bg-secondary text-foreground hover:bg-secondary/80' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25'
              }`}
            >
              <Play className="w-4 h-4" />
              {isCompleted ? 'Review Solution' : 'Solve Now'}
            </Link>
          </motion.div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg mb-4">
            <img src={user?.avatar} alt={user?.username} className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{user?.username}</h2>
          <p className="text-muted-foreground mb-6">Rank: <span className="font-semibold text-foreground">124,532</span></p>
          
          <div className="w-full grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-secondary p-4 rounded-xl">
              <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{user?.contestRating}</div>
              <div className="text-xs text-muted-foreground mt-1">Contest Rating</div>
            </div>
            <div className="bg-secondary p-4 rounded-xl">
              <Code2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{solvedSet.size}</div>
              <div className="text-xs text-muted-foreground mt-1">Problems Solved</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Solving Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatRing title="Easy" solved={easySolved} total={totalEasy} color="text-easy" stroke="stroke-easy" />
            <StatRing title="Medium" solved={mediumSolved} total={totalMedium} color="text-medium" stroke="stroke-medium" />
            <StatRing title="Hard" solved={hardSolved} total={totalHard} color="text-hard" stroke="stroke-hard" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Submissions</h3>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No submissions yet. Start coding!</div>
          ) : (
            <div className="space-y-4">
              {submissions.slice(0, 5).map(sub => {
                const problem = problems.find(p => p.id === sub.problemId);
                const isSuccess = sub.status === 'Accepted';
                return (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">{problem?.title || 'Unknown Problem'}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" /> {new Date(sub.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${isSuccess ? 'text-easy' : 'text-destructive'}`}>
                      {sub.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Heatmap Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Activity</h3>
          <div className="text-sm text-muted-foreground mb-6">34 submissions in the past year</div>
          <div className="grid grid-cols-12 gap-1 overflow-hidden">
            {/* Generate random mock heatmap squares */}
            {Array.from({ length: 60 }).map((_, i) => {
              const intensity = Math.random();
              let bg = 'bg-secondary';
              if (intensity > 0.9) bg = 'bg-primary';
              else if (intensity > 0.7) bg = 'bg-primary/70';
              else if (intensity > 0.5) bg = 'bg-primary/40';
              
              return <div key={i} className={`w-full aspect-square rounded-sm ${bg}`}></div>;
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StatRing = ({ title, solved, total, color, stroke }: { title: string, solved: number, total: number, color: string, stroke: string }) => {
  const percentage = total === 0 ? 0 : (solved / total) * 100;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 bg-background rounded-xl border border-border">
      <div className="relative w-24 h-24 flex items-center justify-center mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} className="stroke-secondary fill-none stroke-[8]" />
          <circle 
            cx="48" cy="48" r={radius} 
            className={`${stroke} fill-none stroke-[8] transition-all duration-1000 ease-out`}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">{solved}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{title}</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{solved} / {total} Solved</div>
    </div>
  );
};

export default Dashboard;
