import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { bookmarkService } from '../services/bookmarks';
import { problemService } from '../services/problems';
import { Problem, Bookmark } from '../types';
import { Bookmark as BookmarkIcon, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Bookmarks: React.FC = () => {
  const [bookmarkedProblems, setBookmarkedProblems] = useState<(Problem & { bookmarkId: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      const bookmarks = await bookmarkService.getBookmarks(user.id);
      const problems = await problemService.getProblems();
      
      const enriched = bookmarks.map(b => {
        const p = problems.find(prob => prob.id === b.problemId);
        return p ? { ...p, bookmarkId: b.id } : null;
      }).filter(Boolean) as (Problem & { bookmarkId: string })[];
      
      setBookmarkedProblems(enriched);
      setIsLoading(false);
    };
    fetchBookmarks();
  }, [user]);

  const handleRemove = async (problemId: string) => {
    if (!user) return;
    await bookmarkService.toggleBookmark(user.id, problemId);
    setBookmarkedProblems(prev => prev.filter(p => p.id !== problemId));
  };

  if (isLoading) {
    return <div className="max-w-5xl mx-auto p-6 mt-8 animate-pulse"><div className="h-10 w-48 bg-secondary rounded mb-8"></div><div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 w-full bg-secondary/50 rounded-xl"></div>)}</div></div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <BookmarkIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookmarked Problems</h1>
          <p className="text-muted-foreground">Problems you've saved for later review</p>
        </div>
      </div>

      {bookmarkedProblems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50">
          <BookmarkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No bookmarked problems yet.</h3>
          <p className="text-muted-foreground mt-1">Click the bookmark icon on any problem to save it here.</p>
          <Link to="/problems" className="inline-block mt-4 text-primary hover:underline">Browse Problems</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarkedProblems.map((problem) => (
            <div key={problem.id} className="bg-card border border-border hover:border-primary/50 transition-colors rounded-2xl p-6 flex items-center justify-between group">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-3">
                  {problem.title}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {problem.difficulty}
                  </span>
                </h3>
                <div className="flex gap-2">
                  {problem.tags.map(tag => (
                    <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleRemove(problem.id)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Remove Bookmark"
                >
                  <BookmarkIcon className="w-5 h-5 fill-current" />
                </button>
                <Link 
                  to={`/problems/${problem.slug}`}
                  className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Solve
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
