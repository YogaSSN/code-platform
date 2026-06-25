import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { checkAuth } from './store/slices/authSlice';
import { fetchActiveRoom } from './store/slices/roomSlice';
import { fetchActiveChallenge } from './store/slices/challengeSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemWorkspace from './pages/ProblemWorkspace';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Contests from './pages/Contests';
import SubmitHistory from './pages/SubmitHistory';
import Bookmarks from './pages/Bookmarks';

// Admin Pages
import ProblemManagement from './pages/Admin/ProblemManagement';
import UserManagement from './pages/Admin/UserManagement';

// Private Room Pages
import CreateRoom from './pages/Rooms/CreateRoom';
import JoinRoom from './pages/Rooms/JoinRoom';
import RoomDashboard from './pages/Rooms/RoomDashboard';
import RoomWorkspace from './pages/Rooms/RoomWorkspace';
import RoomHistory from './pages/Rooms/RoomHistory';
import RoomsLanding from './pages/Rooms/index';

// Challenges
import ChallengesLanding from './pages/Challenges';
import CreateChallenge from './pages/Challenges/CreateChallenge';
import JoinChallenge from './pages/Challenges/JoinChallenge';
import ChallengeHistory from './pages/Challenges/ChallengeHistory';
import ChallengeWorkspace from './pages/Challenges/ChallengeWorkspace';

// AI Pages
import PlacementReadiness from './pages/AI/PlacementReadiness';
import LearningPath from './pages/AI/LearningPath';

// Core
import AuthGuard from './components/AuthGuard';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { status, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Handle active session recovery
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchActiveRoom(user.id));
      dispatch(fetchActiveChallenge(user.id));
    }
  }, [isAuthenticated, user, dispatch]);

  // Handle initial loading
  if (status === 'loading') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="problems" element={<Problems />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="contests" element={<Contests />} />
          <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Routes */}
          <Route path="dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="profile" element={<AuthGuard><Profile /></AuthGuard>} />
          
          <Route path="admin/problems" element={<RoleProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><ProblemManagement /></RoleProtectedRoute>} />
          <Route path="admin/users" element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}><UserManagement /></RoleProtectedRoute>} />
          
          <Route path="submit-history" element={<AuthGuard><SubmitHistory /></AuthGuard>} />
          <Route path="bookmarks" element={<AuthGuard><Bookmarks /></AuthGuard>} />
          
          {/* AI Routes */}
          <Route path="ai/placement-readiness" element={<AuthGuard><PlacementReadiness /></AuthGuard>} />
          <Route path="ai/learning-path" element={<AuthGuard><LearningPath /></AuthGuard>} />
          
          {/* Private Room Routes */}
          <Route path="rooms" element={<AuthGuard><RoomsLanding /></AuthGuard>} />
          <Route path="rooms/create" element={<AuthGuard><CreateRoom /></AuthGuard>} />
          <Route path="rooms/join" element={<AuthGuard><JoinRoom /></AuthGuard>} />
          <Route path="rooms/history" element={<AuthGuard><RoomHistory /></AuthGuard>} />
          <Route path="rooms/:roomId" element={<AuthGuard><RoomDashboard /></AuthGuard>} />
          {/* Challenge Routes */}
          <Route path="challenges" element={<AuthGuard><ChallengesLanding /></AuthGuard>} />
          <Route path="challenges/create" element={<AuthGuard><CreateChallenge /></AuthGuard>} />
          <Route path="challenges/join" element={<AuthGuard><JoinChallenge /></AuthGuard>} />
          <Route path="challenges/history" element={<AuthGuard><ChallengeHistory /></AuthGuard>} />
        </Route>

        {/* Workspace Route (Standalone Layout) */}
        <Route path="/problems/:slug" element={<WorkspaceLayout />}>
          <Route index element={<AuthGuard><ProblemWorkspace /></AuthGuard>} />
        </Route>
        
        <Route path="/rooms/:roomId/problem/:slug" element={<WorkspaceLayout />}>
          <Route index element={<AuthGuard><RoomWorkspace /></AuthGuard>} />
        </Route>

        <Route path="/challenges/:challengeId" element={<AuthGuard><ChallengeWorkspace /></AuthGuard>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

const App = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
