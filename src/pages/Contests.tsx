import React from 'react';
import { Trophy, Clock, Users, ArrowRight } from 'lucide-react';

const Contests: React.FC = () => {
  return (
    <div className="space-y-12">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Coding Contests</h1>
        <p className="text-lg text-muted-foreground">Test your skills against peers worldwide. Compete in our weekly and biweekly contests to win prizes and earn reputation.</p>
      </header>

      <section className="bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary font-medium text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Upcoming Contest
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Weekly Contest 389</h2>
          <p className="text-muted-foreground mb-8 text-lg">Join us this Sunday at 10:30 AM. 4 algorithmic problems ranging from Easy to Hard.</p>
          
          <div className="flex flex-wrap items-center gap-8 mb-8">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Starts In</span>
              <div className="text-3xl font-mono font-bold text-foreground">2d 14h 32m</div>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Registered</span>
              <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Users className="w-5 h-5 text-muted-foreground" /> 12,403
              </div>
            </div>
          </div>
          
          <button className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-xl flex items-center gap-2">
            Register Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-foreground">Past Contests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[388, 387, 386, 385, 384, 383].map(num => (
            <div key={num} className="bg-card border border-border p-6 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Weekly Contest {num}</h4>
                <Trophy className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Ended</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> ~18,000 Participants</div>
              </div>
              <button className="w-full py-2 bg-secondary text-foreground font-medium rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                View Ranking
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contests;
