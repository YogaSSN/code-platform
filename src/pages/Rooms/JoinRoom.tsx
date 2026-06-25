import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { joinRoom } from '../../store/slices/roomSlice';
import { AppDispatch, RootState } from '../../store';
import { KeyRound, ArrowRight, ShieldAlert } from 'lucide-react';
import { useActiveSession } from '../../hooks/useActiveSession';

import { roomService } from '../../services/rooms';
import { Room } from '../../types';

const JoinRoom: React.FC = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roomPreview, setRoomPreview] = useState<Room | null>(null);
  const [isSpectatorCode, setIsSpectatorCode] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || inviteCode.length < 6) {
      setError('Please enter a valid 6-character invite code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const code = inviteCode.toUpperCase();
      const room = await roomService.getRoomByInviteCode(code);
      if (!room) {
        throw new Error("Invalid invite code or room not found.");
      }
      setRoomPreview(room);
      setIsSpectatorCode(room.spectatorCode === code);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch room preview.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const action = await dispatch(joinRoom({ userId: user!.id, username: user!.username, inviteCode: inviteCode.toUpperCase() })).unwrap();
      navigate(`/rooms/${action.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join room.');
      setRoomPreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const { sessionType, activeChallenge } = useActiveSession();

  if (sessionType === 'CHALLENGE') {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-card border border-border rounded-3xl text-center">
        <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Challenge in Progress</h1>
        <p className="text-muted-foreground mb-8">You cannot join a room while participating in an active 1 vs 1 Challenge.</p>
        <button onClick={() => navigate(`/challenges/${activeChallenge?.id}`)} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">Resume Challenge</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <div className="bg-card border border-border rounded-md shadow-sm p-8 relative">

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Join Private Room</h1>
          <p className="text-muted-foreground mt-2">Enter the invite code provided by the host</p>
        </div>

        {!roomPreview ? (
          <form onSubmit={handlePreview} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 text-center">
                Invite Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. A1B2C3"
                className="w-full bg-background border border-border rounded-md px-4 py-4 text-center text-2xl font-mono tracking-[0.25em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                maxLength={6}
              />
              {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || inviteCode.length < 6}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Preview Room
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 relative z-10">
            <div className="bg-secondary/30 rounded-md p-6 border border-border space-y-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Room Name</div>
                <div className="text-lg font-bold text-foreground">{roomPreview.roomName}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Hosted By</div>
                  <div className="text-sm font-medium text-foreground">{roomPreview.hostName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Duration</div>
                  <div className="text-sm font-medium text-foreground">{Math.floor(roomPreview.duration / 60000)} Minutes</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Problems</div>
                  <div className="text-sm font-medium text-foreground">{roomPreview.problems.length} Problems</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Languages</div>
                  <div className="text-sm font-medium text-foreground">{roomPreview.allowedLanguages.length} Allowed</div>
                </div>
              </div>
              {isSpectatorCode && (
                <div className="bg-primary/10 border border-primary/20 text-primary p-3 rounded-lg text-sm font-medium flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> Joining as Spectator
                </div>
              )}
            </div>

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setRoomPreview(null)}
                className="flex-1 bg-secondary text-foreground font-semibold py-3 px-4 rounded-md hover:bg-secondary/80 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleJoin}
                disabled={isLoading}
                className="flex-[2] bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Join Room <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRoom;
