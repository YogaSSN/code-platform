import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ChevronLeft, Settings, Layout, Code2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleTheme } from '../store/slices/themeSlice';
import { Moon, Sun } from 'lucide-react';

const WorkspaceLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mode } = useSelector((state: RootState) => state.theme);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Workspace Navbar */}
      <nav className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Problems</span>
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-2 text-primary">
            <Code2 className="w-5 h-5" />
            <span className="font-bold tracking-tight">CodePlatform</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => dispatch(toggleTheme())} className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors">
            {mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-md transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          {!isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
              <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">Sign up</Link>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border ml-2">
              <img src={user?.avatar} alt={user?.username} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkspaceLayout;
