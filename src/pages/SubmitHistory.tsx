import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { submissionService } from '../services/submissions';
import { problemService } from '../services/problems';
import { Submission, Problem } from '../types';
import { History, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmitHistory: React.FC = () => {
  const [submissions, setSubmissions] = useState<(Submission & { problemTitle: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const userSubs = await submissionService.getSubmissions(user.id);
      
      // We need problem titles for the table
      const problems = await problemService.getProblems();
      const problemMap = new Map(problems.map(p => [p.id, p.title]));
      
      const enrichedSubs: (Submission & { problemTitle: string })[] = userSubs.map(s => ({
        ...s,
        problemTitle: problemMap.get(s.problemId) || 'Unknown Problem'
      }));
      
      setSubmissions(enrichedSubs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.problemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="max-w-7xl mx-auto p-6 mt-8 animate-pulse"><div className="h-10 w-48 bg-secondary rounded mb-8"></div><div className="h-[400px] w-full bg-secondary/50 rounded-2xl"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Submission History</h1>
            <p className="text-muted-foreground">Review your past code executions and verdicts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Wrong Answer">Wrong Answer</option>
              <option value="Time Limit Exceeded">Time Limit Exceeded</option>
              <option value="Runtime Error">Runtime Error</option>
              <option value="Compilation Error">Compilation Error</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Time Submitted</th>
                <th className="px-6 py-4 font-medium">Problem</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Runtime</th>
                <th className="px-6 py-4 font-medium">Memory</th>
                <th className="px-6 py-4 font-medium">Language</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No submissions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <Link to={`/problems/${sub.problemId}`} className="hover:text-primary transition-colors">
                        {sub.problemTitle}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex font-medium px-2.5 py-1 rounded-md text-xs ${
                        sub.status === 'Accepted' ? 'bg-green-500/10 text-green-500' :
                        sub.status === 'Wrong Answer' ? 'bg-red-500/10 text-red-500' :
                        sub.status === 'Time Limit Exceeded' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono">{sub.runtime} ms</td>
                    <td className="px-6 py-4 font-mono">{sub.memory} MB</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-secondary rounded text-xs text-muted-foreground font-mono">
                        {sub.language}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmitHistory;
