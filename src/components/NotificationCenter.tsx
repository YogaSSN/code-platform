import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { notificationService } from '../services/notifications';
import { Notification } from '../types';
import { Bell, Trophy, Calendar, MessageSquare, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchNotifs = async () => {
      if (!user) return;
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
    };
    fetchNotifs();
    
    // Simple polling for new notifications
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0 && user) {
      // Mark all as read when opening
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ACHIEVEMENT': return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'DAILY_CHALLENGE': return <Calendar className="w-4 h-4 text-primary" />;
      case 'ANNOUNCEMENT': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'ROOM_INVITE': return <ShieldAlert className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
            <h3 className="font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>}
          </div>
          
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 opacity-20 mx-auto mb-2" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(n => (
                  <div key={n.id} className={`p-4 hover:bg-secondary/30 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                    <div className="flex gap-3">
                      <div className="mt-0.5 bg-background p-1.5 rounded-full border border-border shadow-sm h-fit">
                        {getIcon(n.type)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-0.5">{n.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-muted-foreground/60 mt-2 block font-medium">
                          {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-border text-center bg-secondary/30">
            <Link to="/profile" onClick={() => setIsOpen(false)} className="text-xs font-medium text-primary hover:underline">View All Activity</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
