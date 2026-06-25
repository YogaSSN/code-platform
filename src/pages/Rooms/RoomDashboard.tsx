import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { endRoom, leaveRoom, fetchActiveRoom } from '../../store/slices/roomSlice';
import { RootState, AppDispatch } from '../../store';
import { roomService } from '../../services/rooms';
import { Room, Announcement, LeaderboardEntry } from '../../types';
import { Users, Clock, Send, Trophy, LogOut, ShieldAlert, Code2, Copy, CheckCircle2 } from 'lucide-react';

const RoomDashboard: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myParticipantData, setMyParticipantData] = useState<any>(null);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isEnded, setIsEnded] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const isHost = room?.hostId === user?.id;
  const isSpectator = room?.spectators?.includes(user?.id || '') || false;
  const isParticipant = room?.participants?.includes(user?.id || '') || false;

  // Polling data (since we rely on localstorage without true WebSockets for now)
  useEffect(() => {
    if (!roomId) return;
    
    const fetchData = async () => {
      const roomData = await roomService.getRoom(roomId);
      if (!roomData) {
        navigate('/private-room/history');
        return;
      }
      setRoom(roomData);
      
      const annData = await roomService.getAnnouncements(roomId);
      setAnnouncements(annData);
      
      const lbData = await roomService.getLeaderboard(roomId);
      setLeaderboard(lbData);
      
      if (user) {
        const parts = await roomService.getParticipants(roomId);
        const me = parts.find(p => p.userId === user.id);
        if (me) setMyParticipantData(me);
      }
      
      if (roomData.status === 'ENDED' || Date.now() >= roomData.endTime) {
        setIsEnded(true);
        if (roomData.status !== 'ENDED' && isHost) {
          await roomService.endRoom(roomId, user!.id);
          dispatch(fetchActiveRoom(user!.id));
        }
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, [roomId, navigate, isHost, user, dispatch]);

  // Timer Countdown
  useEffect(() => {
    if (!room || isEnded) return;

    const updateTimer = () => {
      const diff = room.endTime - Date.now();
      if (diff <= 0) {
        setTimeRemaining('00:00:00');
        setIsEnded(true);
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0');
      const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
      setTimeRemaining(`${h}:${m}:${s}`);
    };
    
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [room, isEnded]);

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim() || !room || !user) return;
    await roomService.createAnnouncement(room.id, newAnnouncement, user.username);
    setNewAnnouncement('');
    const annData = await roomService.getAnnouncements(room.id);
    setAnnouncements(annData);
  };

  const handleEndRoom = async () => {
    if (!room || !user) return;
    if (confirm('Are you sure you want to end this room early for everyone?')) {
      await dispatch(endRoom({ roomId: room.id, hostId: user.id }));
      setIsEnded(true);
    }
  };

  const handleLeaveRoom = async () => {
    if (!room || !user) return;
    if (confirm('Are you sure you want to leave this room?')) {
      await dispatch(leaveRoom({ userId: user.id, roomId: room.id }));
      navigate('/dashboard');
    }
  };

  const copyInvite = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!room) return <div className="p-8 text-center text-muted-foreground">Loading Room...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 mt-4">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-md p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative">
        
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{room.roomName}</h1>
            {isEnded && <span className="px-2.5 py-0.5 text-xs font-bold bg-destructive/20 text-destructive rounded-full uppercase tracking-wider">Ended</span>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-secondary rounded-md"><Users className="w-4 h-4" /> Hosted by {room.hostName || 'Host'}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {room.participants.length} Participants</span>
            {room.allowSpectators && <span className="flex items-center gap-1.5 text-primary"><ShieldAlert className="w-4 h-4" /> {room.spectators?.length || 0} Spectators</span>}
            <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4" /> {room.problems.length} Problems</span>
            <span className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-md">LB: {room.leaderboardVisibility}</span>
            <span className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-md">Chat: {room.chatEnabled ? 'On' : 'Off'}</span>
            <span className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-md" title={room.allowedLanguages.join(', ')}>
              {room.allowedLanguages.length} Languages
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {!isEnded && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Time Remaining</p>
              <div className="text-3xl font-mono font-bold text-primary tabular-nums">{timeRemaining || '--:--:--'}</div>
            </div>
          )}
          
          <div className="flex gap-2">
            {isHost && !isEnded && (
              <button onClick={handleEndRoom} className="px-4 py-2 bg-destructive text-destructive-foreground font-medium rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> End Room
              </button>
            )}
            {!isHost && !isEnded && (
              <button onClick={handleLeaveRoom} className="px-4 py-2 border border-border text-foreground hover:bg-secondary font-medium rounded-lg transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Leave Room
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Problems & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Problems List */}
          <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-secondary/30">
              <h2 className="font-semibold flex items-center gap-2 text-lg">
                <Code2 className="w-5 h-5 text-primary" /> Assigned Problems
              </h2>
            </div>
            <div className="divide-y divide-border">
              {room.problems.map((p, index) => (
                <div key={p.id} className="p-5 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center font-bold font-mono">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <div>
                      <h3 className="font-medium text-foreground">{p.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                        p.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                        p.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>{p.difficulty}</span>
                    </div>
                  </div>
                  
                  {isEnded ? (
                    <span className="text-sm font-medium text-muted-foreground px-4 py-2 bg-secondary rounded-lg">Locked</span>
                  ) : isSpectator ? (
                    <span className="text-sm font-medium text-primary px-4 py-2 bg-primary/10 rounded-lg flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Spectating</span>
                  ) : myParticipantData?.solvedProblemIds?.includes(p.id) ? (
                    <span className="text-sm font-medium text-green-500 px-4 py-2 bg-green-500/10 rounded-lg flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Solved</span>
                  ) : (
                    <Link 
                      to={`/rooms/${room.id}/problem/${p.slug}`}
                      className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-lg transition-colors text-sm"
                    >
                      Solve
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="bg-card border border-border rounded-md shadow-sm flex flex-col min-h-[400px]">
            <div className="p-5 border-b border-border bg-secondary/30">
              <h2 className="font-semibold text-lg">{room.chatEnabled ? 'Chat & Announcements' : 'Announcements'}</h2>
            </div>
            
            <div className="flex-grow p-5 flex flex-col-reverse space-y-4 space-y-reverse overflow-y-auto max-h-[400px]">
              {announcements.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">No announcements yet.</div>
              ) : (
                announcements.map(ann => (
                  <div key={ann.id} className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                    <p className="text-foreground text-sm leading-relaxed">{ann.message}</p>
                    <div className="text-xs text-muted-foreground mt-2 font-medium">
                      {ann.authorName || 'Host'} • {new Date(ann.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {((room.chatEnabled && !isEnded) || (isHost && !isEnded) || (isSpectator && !isEnded)) && (
              <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handlePostAnnouncement} className="flex gap-2">
                  <input
                    type="text"
                    value={newAnnouncement}
                    onChange={e => setNewAnnouncement(e.target.value)}
                    placeholder="Broadcast message to all participants..."
                    className="flex-grow bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button 
                    type="submit" 
                    disabled={!newAnnouncement.trim()}
                    className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Invite Code & Leaderboard */}
        <div className="space-y-6">
          {/* Invite Code Box (Host Only) */}
          {isHost && !isEnded && (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-md p-5 shadow-sm text-center relative group">
                <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-widest relative z-10">Participant Code</p>
                <div 
                  onClick={() => copyInvite(room.inviteCode)}
                  className="text-4xl font-mono font-bold text-foreground tracking-[0.2em] cursor-pointer hover:text-primary transition-colors flex items-center justify-center gap-3 relative z-10"
                  title="Click to copy participant code"
                >
                  {room.inviteCode}
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </div>

              {room.allowSpectators && (
                <div className="bg-secondary/30 border border-border rounded-md p-5 shadow-sm text-center relative group">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-widest relative z-10">Spectator Code</p>
                  <div 
                    onClick={() => copyInvite(room.spectatorCode)}
                    className="text-2xl font-mono font-bold text-foreground tracking-[0.2em] cursor-pointer hover:text-primary transition-colors flex items-center justify-center gap-3 relative z-10"
                    title="Click to copy spectator code"
                  >
                    {room.spectatorCode}
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden flex flex-col max-h-[600px]">
            <div className="p-5 border-b border-border bg-secondary/30 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
              </h2>
              {(!isHost && !isEnded && room.leaderboardVisibility === 'HIDDEN') && (
                <span className="text-xs font-medium bg-secondary text-muted-foreground px-2 py-1 rounded">Hidden until end</span>
              )}
            </div>

            <div className="overflow-y-auto flex-grow p-0">
              {(!isHost && !isEnded && room.leaderboardVisibility === 'HIDDEN') ? (
                <div className="p-8 text-center">
                  <ShieldAlert className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">Leaderboard is hidden for participants while the contest is running to prevent cheating.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-muted-foreground sticky top-0">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Rank</th>
                      <th className="py-3 px-4 text-left font-medium">User</th>
                      <th className="py-3 px-4 text-center font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leaderboard.length === 0 ? (
                      <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No participants yet.</td></tr>
                    ) : (
                      leaderboard.map(entry => (
                        <tr key={entry.userId} className={`hover:bg-secondary/30 transition-colors ${entry.userId === user?.id ? 'bg-primary/5' : ''}`}>
                          <td className="py-3 px-4">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                              entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                              entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                              entry.rank === 3 ? 'bg-amber-700/20 text-amber-700' :
                              'text-muted-foreground'
                            }`}>
                              {entry.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-foreground flex items-center gap-2">
                            {entry.username}
                            {entry.userId === user?.id && <span className="text-[10px] uppercase bg-primary/20 text-primary px-1.5 rounded-sm">You</span>}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-medium">{entry.score}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDashboard;
