import React from 'react';
import { Code2, Trophy, Users, Zap, Terminal, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col gap-12 py-8 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6 mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          CodePulse Platform
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Solve problems. Compete with friends. Track your progress. Built by students, for placement preparation.
        </p>
        
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link to="/register" className="px-6 py-3 bg-foreground text-background font-semibold rounded-md hover:bg-foreground/90 transition-colors flex items-center gap-2">
            Start Coding <ChevronRight className="w-4 h-4" />
          </Link>
          <Link to="/problems" className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/80 transition-colors">
            View Problems
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
        <div className="border border-border p-6 rounded-md bg-card">
          <Terminal className="w-6 h-6 text-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Practice Environment</h3>
          <p className="text-sm text-muted-foreground">Standard editor with multiple languages supported. Prepare for coding rounds.</p>
        </div>
        <div className="border border-border p-6 rounded-md bg-card">
          <Trophy className="w-6 h-6 text-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Competitions</h3>
          <p className="text-sm text-muted-foreground">Global contests and 1v1 challenges to improve your speed.</p>
        </div>
        <div className="border border-border p-6 rounded-md bg-card">
          <Zap className="w-6 h-6 text-foreground mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Fast Execution</h3>
          <p className="text-sm text-muted-foreground">Immediate feedback on time limit and constraints.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border pt-12 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">20+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Languages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">5K+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Problems</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">1M+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Developers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">10M+</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Submissions</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
