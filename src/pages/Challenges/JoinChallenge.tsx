import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, ChevronLeft, ShieldAlert } from 'lucide-react';
import { joinChallenge } from '../../store/slices/challengeSlice';
import { AppDispatch, RootState } from '../../store';
import { useActiveSession } from '../../hooks/useActiveSession';

const JoinChallenge: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;
    
    setIsJoining(true);
    setError('');
    
    try {
      const resultAction = await dispatch(joinChallenge({
        userId: user.id,
        inviteCode: inviteCode.trim().toUpperCase()
      }));
      
      if (joinChallenge.fulfilled.match(resultAction)) {
        navigate(`/challenges/${resultAction.payload.id}`);
      } else {
        setError(resultAction.error.message || 'Failed to join challenge. Please check the code.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsJoining(false);
    }
  };

  const { isBusy, sessionType, activeChallenge, activeRoom } = useActiveSession();

  if (isBusy) {
    const isRoom = sessionType === 'ROOM';
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-card border border-border rounded-md text-center">
        <ShieldAlert className={`w-16 h-16 mx-auto mb-4 ${isRoom ? 'text-primary' : 'text-orange-500'}`} />
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {isRoom ? 'Active Room Detected' : 'Challenge in Progress'}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isRoom 
            ? 'You cannot join a challenge while participating in a Private Room.' 
            : 'You are already participating in an active 1 vs 1 Challenge.'}
        </p>
        <button 
          onClick={() => isRoom ? navigate(`/rooms/${activeRoom?.id}`) : navigate(`/challenges/${activeChallenge?.id}`)} 
          className={`px-6 py-3 font-bold rounded-xl transition-colors ${isRoom ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
        >
          {isRoom ? 'Resume Room' : 'Resume Challenge'}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <button 
        onClick={() => navigate('/challenges')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Challenges
      </button>

      <div className="bg-card border border-border rounded-md overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-border bg-secondary/30 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Join Challenge</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter an invite code to duel.</p>
          </div>
        </div>

        <form onSubmit={handleJoin} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Invite Code</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="e.g. ABC123"
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-4 text-center text-2xl font-mono tracking-widest text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
              maxLength={6}
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isJoining || inviteCode.length < 3}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-md transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isJoining ? 'Joining...' : 'Join Duel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinChallenge;
