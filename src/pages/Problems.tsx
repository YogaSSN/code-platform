import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { problemService } from '../services/problems';
import { submissionService } from '../services/submissions';
import { Problem } from '../types';
import { Search, Filter, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const Problems: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');

  useEffect(() => {
    const loadData = async () => {
      const allProblems = await problemService.getProblems();
      setProblems(allProblems);
      
      if (user) {
        const subs = await submissionService.getSubmissions(user.id);
        const solved = new Set(subs.filter(s => s.status === 'Accepted').map(s => s.problemId));
        setSolvedSet(solved);
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.id.includes(searchQuery);
    const matchesDifficulty = difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return <div className="animate-pulse h-96 bg-card rounded-2xl"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Problems</h1>
          <p className="text-muted-foreground mt-1">Master algorithms and data structures.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search problems..."
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="py-4 px-6 text-sm font-medium text-muted-foreground w-16">Status</th>
                <th className="py-4 px-6 text-sm font-medium text-muted-foreground w-20">ID</th>
                <th className="py-4 px-6 text-sm font-medium text-muted-foreground">Title</th>
                <th className="py-4 px-6 text-sm font-medium text-muted-foreground w-32">Acceptance</th>
                <th className="py-4 px-6 text-sm font-medium text-muted-foreground w-32">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    No problems found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem, index) => {
                  const isSolved = solvedSet.has(problem.id);
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      key={problem.id} 
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-easy" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{index + 1}</td>
                      <td className="py-4 px-6 font-medium">
                        <Link to={`/problems/${problem.slug}`} className="text-foreground hover:text-primary transition-colors">
                          {problem.title}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{problem.acceptanceRate}%</td>
                      <td className="py-4 px-6">
                        <span className={`text-sm font-medium ${
                          problem.difficulty === 'Easy' ? 'text-easy' : 
                          problem.difficulty === 'Medium' ? 'text-medium' : 'text-hard'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Problems;
