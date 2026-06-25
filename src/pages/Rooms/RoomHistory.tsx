import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { roomService } from '../../services/rooms';
import { Room } from '../../types';
import { History, Users, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoomHistory: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const history = await roomService.getRoomHistory(user.id);
        setRooms(history);
      }
      setIsLoading(false);
    };
    fetchHistory();
  }, [user]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-8 space-y-4">
        <div className="h-8 w-48 bg-secondary rounded-md animate-pulse"></div>
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 w-full bg-secondary/50 rounded-xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room History</h1>
          <p className="text-muted-foreground">Review your past private contests and results</p>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/50">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No Room History</h3>
          <p className="text-muted-foreground mt-1">You haven't participated in any private rooms yet.</p>
          <Link to="/rooms/join" className="inline-block mt-4 text-primary hover:underline">Join a room</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => {
            const durationMins = Math.round((room.endTime - room.startTime) / 60000);
            const isHost = room.hostId === user?.id;
            
            return (
              <div key={room.id} className="bg-card border border-border hover:border-primary/50 transition-colors rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{room.roomName}</h3>
                    {isHost && <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">Host</span>}
                    <span className="px-2 py-0.5 text-xs font-medium bg-secondary text-muted-foreground rounded-full">
                      {new Date(room.startTime).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {room.participants.length} Participants
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {durationMins} Mins
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4" />
                      {room.problems.length} Problems
                    </div>
                  </div>
                </div>

                <Link 
                  to={`/rooms/${room.id}`}
                  className="px-6 py-2.5 bg-secondary text-foreground hover:bg-secondary/80 font-medium rounded-lg transition-colors flex items-center gap-2 shrink-0 w-full md:w-auto justify-center"
                >
                  View Results
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomHistory;
