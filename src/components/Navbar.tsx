import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Trophy, List, MessageSquare, Moon, Sun, User as UserIcon, LogOut, ShieldAlert, Swords, BrainCircuit, Route } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleTheme } from '../store/slices/themeSlice';
import { logout } from '../store/slices/authSlice';
import { fetchActiveRoom } from '../store/slices/roomSlice';
import NotificationCenter from './NotificationCenter';

const Navbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { mode } = useSelector((state: RootState) => state.theme);
  const { activeRoom } = useSelector((state: RootState) => state.room);

  React.useEffect(() => {
    if (user) {
      dispatch(fetchActiveRoom(user.id));
    }
  }, [user, dispatch]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <Code2 className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-foreground">CodePlatform</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/problems" icon={<List className="w-4 h-4" />} text="Problems" active={isActive('/problems')} />
            <NavLink to="/contests" icon={<Trophy className="w-4 h-4" />} text="Contests" active={isActive('/contests')} />
            <NavLink to="/leaderboard" icon={<UserIcon className="w-4 h-4" />} text="Leaderboard" active={isActive('/leaderboard')} />
            <NavLink to="/rooms" icon={<ShieldAlert className="w-4 h-4" />} text="Rooms" active={isActive('/rooms') || location.pathname.startsWith('/rooms')} />
            <NavLink to="/challenges" icon={<Swords className="w-4 h-4" />} text="Challenges" active={isActive('/challenges')} />
            <NavLink to="/ai/placement-readiness" icon={<BrainCircuit className="w-4 h-4 text-purple-500" />} text="Placement AI" active={isActive('/ai/placement-readiness')} />
            <NavLink to="/ai/learning-path" icon={<Route className="w-4 h-4 text-emerald-500" />} text="Learning Path" active={isActive('/ai/learning-path')} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3 ml-2">
              <button 
                onClick={() => dispatch(toggleTheme())} 
                className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors"
              >
                {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Sign in
              </Link>
              <Link to="/register" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Create account
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-r border-border pr-4 mr-2">
              <button 
                onClick={() => dispatch(toggleTheme())} 
                className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors"
              >
                {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <NotificationCenter />
            </div>
          )}
          
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">Dashboard</Link>
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors flex items-center justify-center bg-secondary text-sm font-bold text-foreground">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user?.username.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Profile</Link>
                  <Link to="/submit-history" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Submission History</Link>
                  <Link to="/bookmarks" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Bookmarks</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-secondary">Dashboard</Link>
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'admin' as any) && (
                    <Link to="/admin/problems" className="block px-4 py-2 text-sm text-primary hover:bg-secondary font-medium">Manage Problems</Link>
                  )}
                  {user?.role === 'SUPER_ADMIN' && (
                    <Link to="/admin/users" className="block px-4 py-2 text-sm text-purple-500 hover:bg-secondary font-medium">Manage Users</Link>
                  )}
                  <div className="h-px bg-border my-1"></div>
                  <button 
                    onClick={() => dispatch(logout())}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-secondary"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, active }: { to: string; icon: React.ReactNode; text: string; active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active 
        ? 'bg-secondary text-foreground' 
        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
    }`}
  >
    {icon}
    {text}
  </Link>
);

export default Navbar;
