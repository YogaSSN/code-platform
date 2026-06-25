import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Swords, Activity, ArrowRight, Play, Plus, LogIn, History } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion } from 'framer-motion';

const RoomsLanding: React.FC = () => {
  const { activeRoom } = useSelector((state: RootState) => state.room);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 space-y-12">
      
      {/* Hero Section */}
      <section className="bg-card border border-border rounded-md p-8 md:p-12 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6">
            <ShieldAlert className="w-4 h-4" /> The Arena
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
            Private Coding Rooms
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/rooms/create" className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              <Swords className="w-5 h-5" /> Create Room
            </Link>
            <Link to="/rooms/join" className="w-full sm:w-auto px-8 py-3.5 bg-secondary text-foreground font-bold rounded-md hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border/50">
              <Users className="w-5 h-5" /> Join Room
            </Link>
          </div>
        </div>


      </section>

      {/* Active Room Banner */}
      {activeRoom && (
        <div 
          className="bg-card border border-border rounded-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div>
            <div className="text-sm font-bold text-primary tracking-widest uppercase mb-1">Ongoing Session</div>
            <h2 className="text-2xl font-bold text-foreground">{activeRoom.roomName}</h2>
            <p className="text-muted-foreground mt-2">You are currently participating in this room.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link to={`/rooms/${activeRoom.id}`} className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-md hover:bg-primary/90 transition-all flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" /> Go To Room
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Activity />} title="Active Rooms" value="142" />
        <StatCard icon={<Users />} title="Participants Online" value="894" />
        <StatCard icon={<Swords />} title="Total Rooms Created" value="12.5k" />
        <StatCard icon={<ShieldAlert />} title="Completed Battles" value="11.2k" />
      </section>

      {/* Main Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ActionCard 
          to="/challenges"
          icon={<Swords className="w-8 h-8 text-orange-500" />}
          title="1 vs 1 Challenge"
          description="Friend Battles, Quick Coding Duels, and Competitive Practice."
          buttonText="Start Duel"
          primary
          accent="orange"
        />
        <ActionCard 
          to="/rooms/create"
          icon={<Plus className="w-8 h-8 text-primary" />}
          title="Create Room"
          description="Host your own coding competition, training round, or technical assessment."
          buttonText="Create Room"
        />
        <ActionCard 
          to="/rooms/join"
          icon={<Users className="w-8 h-8 text-blue-500" />}
          title="Join Room"
          description="Join an existing room using an invite code from your host or instructor."
          buttonText="Join Room"
        />
        <ActionCard 
          to="/rooms/history"
          icon={<Activity className="w-8 h-8 text-emerald-500" />}
          title="Room History"
          description="View previous rooms, contest results, leaderboards, and your past submissions."
          buttonText="View History"
        />
      </section>

    </div>
  );
};

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="bg-card border border-border rounded-md p-6 flex flex-col items-center justify-center text-center shadow-sm">
    <div className="text-primary/80 mb-3">{icon}</div>
    <div className="text-3xl font-extrabold text-foreground mb-1">{value}</div>
    <div className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{title}</div>
  </div>
);

const ActionCard = ({ to, icon, title, description, buttonText, primary = false, accent = "primary" }: any) => {
  const isOrange = accent === 'orange';
  const borderColor = isOrange ? 'border-orange-500/50 ring-1 ring-orange-500/20' : 'border-primary/50 ring-1 ring-primary/20';
  const iconBg = isOrange ? 'bg-orange-500/10' : 'bg-primary/10';
  const btnBg = isOrange ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-primary text-primary-foreground hover:bg-primary/90';

  return (
    <div className={`bg-card border rounded-md p-8 flex flex-col h-full shadow-sm transition-all ${primary ? borderColor : 'border-border'}`}>
      <div className={`w-16 h-16 rounded-md flex items-center justify-center mb-6 ${primary ? iconBg : 'bg-secondary'}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed flex-grow">{description}</p>
      <Link 
        to={to}
        className={`mt-8 w-full py-3.5 rounded-md font-bold flex items-center justify-center gap-2 transition-colors ${
          primary 
            ? btnBg 
            : 'bg-secondary text-foreground hover:bg-secondary/80'
        }`}
      >
        {buttonText} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default RoomsLanding;
