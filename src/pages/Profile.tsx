import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { submissionService } from '../services/submissions';
import { problemService } from '../services/problems';
import { updateProfile } from '../store/slices/authSlice';
import type { Submission, Problem } from '../types';
import { MapPin, Link as LinkIcon, Building2, CheckCircle2, X, Trophy, Target, Zap, Star } from 'lucide-react';
import RoleBadge from '../components/RoleBadge';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    avatar: '',
    bio: '',
    location: '',
    company: '',
    website: '',
    github: '',
    twitter: ''
  });

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const [subs, probs] = await Promise.all([
          submissionService.getSubmissions(user.id),
          problemService.getProblems()
        ]);
        setSubmissions(subs);
        setProblems(probs);
        setEditForm({
          avatar: user.avatar || '',
          bio: user.bio || '',
          location: user.location || '',
          company: user.company || '',
          website: user.website || '',
          github: user.github || '',
          twitter: user.twitter || ''
        });
      }
      setLoading(false);
    };
    loadData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await dispatch(updateProfile({ userId: user.id, data: editForm }));
      setIsEditing(false);
    }
  };

  if (loading) return <div className="animate-pulse h-[600px] bg-card rounded-2xl"></div>;
  if (!user) return null;

  const solvedCount = new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId)).size;

  const badges = [
    { id: '1', title: 'First Blood', description: 'Solve your first problem', icon: <Target className="w-6 h-6 text-red-500" />, achieved: solvedCount > 0 },
    { id: '2', title: '10 Days Streak', description: 'Submit code 10 days in a row', icon: <Zap className="w-6 h-6 text-yellow-500" />, achieved: false },
    { id: '3', title: '50 Problems Solved', description: 'Complete 50 problems', icon: <Trophy className="w-6 h-6 text-primary" />, achieved: solvedCount >= 50 },
    { id: '4', title: 'Night Owl', description: 'Solve a problem after midnight', icon: <Star className="w-6 h-6 text-indigo-400" />, achieved: true },
    { id: '5', title: 'Room Master', description: 'Host 5 private rooms', icon: <Building2 className="w-6 h-6 text-emerald-500" />, achieved: false },
    { id: '6', title: 'Bug Hunter', description: 'Get 50 Runtime Errors', icon: <X className="w-6 h-6 text-destructive" />, achieved: submissions.filter(s => s.status === 'Runtime Error').length >= 50 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
      {/* Sidebar Profile */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="w-32 h-32 rounded-xl overflow-hidden mb-4 mx-auto md:mx-0 bg-secondary flex items-center justify-center text-4xl font-bold text-foreground">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
            <RoleBadge role={user.role} />
          </div>
          <p className="text-muted-foreground mb-4">Rank ~100,000</p>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full py-2 bg-secondary text-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors mb-6"
          >
            Edit Profile
          </button>
          
          {user.bio && <p className="text-sm text-foreground mb-4">{user.bio}</p>}

          <div className="space-y-3 text-sm text-muted-foreground">
            {user.location && <div className="flex items-center gap-3"><MapPin className="w-4 h-4" /> {user.location}</div>}
            {user.company && <div className="flex items-center gap-3"><Building2 className="w-4 h-4" /> {user.company}</div>}
            {user.website && <div className="flex items-center gap-3 hover:text-foreground cursor-pointer"><LinkIcon className="w-4 h-4" /> <a href={user.website} target="_blank" rel="noreferrer">{user.website.replace(/^https?:\/\//, '')}</a></div>}
            {user.github && <div className="flex items-center gap-3 hover:text-foreground cursor-pointer">github.com/{user.github}</div>}
            {user.twitter && <div className="flex items-center gap-3 hover:text-foreground cursor-pointer">@{user.twitter.replace(/^@/, '')}</div>}
            {!user.location && !user.company && !user.website && !user.github && !user.twitter && (
              <div className="text-muted-foreground/50 text-xs text-center py-2">No additional details provided</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Achievements & Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map(badge => (
              <div key={badge.id} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${badge.achieved ? 'bg-secondary/50 border-border' : 'bg-background border-dashed border-border/50 opacity-50 grayscale'}`}>
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm border border-border">
                  {badge.icon}
                </div>
                <h4 className="font-bold text-sm text-foreground">{badge.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                {badge.achieved && <span className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">Unlocked</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
          
          <div className="space-y-0 mt-8">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Submissions</h4>
            {submissions.slice(0, 10).map(sub => {
              const problem = problems.find(p => p.id === sub.problemId);
              const isSuccess = sub.status === 'Accepted';
              return (
                <div key={sub.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    {isSuccess ? <CheckCircle2 className="w-5 h-5 text-easy" /> : <div className="w-5 h-5 rounded-full bg-destructive/20 border border-destructive/50"></div>}
                    <div>
                      <div className="font-medium text-foreground">{problem?.title || 'Unknown Problem'}</div>
                      <div className="text-xs text-muted-foreground">{new Date(sub.submittedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground font-mono bg-secondary px-2 py-1 rounded">
                    {sub.language}
                  </div>
                </div>
              );
            })}
            {submissions.length === 0 && <div className="text-muted-foreground text-center py-4">No recent activity</div>}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-4 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Avatar</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={editForm.avatar} 
                    onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert('File size must be less than 2MB');
                          return;
                        }
                        try {
                          const fileExt = file.name.split('.').pop();
                          const fileName = `${user?.id || 'unknown'}-${Math.random()}.${fileExt}`;
                          
                          const { error: uploadError } = await supabase.storage
                            .from('avatars')
                            .upload(fileName, file, { upsert: true });

                          if (uploadError) throw uploadError;

                          const { data: { publicUrl } } = supabase.storage
                            .from('avatars')
                            .getPublicUrl(fileName);

                          setEditForm({ ...editForm, avatar: publicUrl });
                        } catch (error) {
                          console.error('Error uploading avatar:', error);
                          alert('Failed to upload avatar.');
                        }
                      }
                    }}
                  />
                  <label 
                    htmlFor="avatar-upload" 
                    className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-md cursor-pointer hover:bg-secondary/80 flex items-center justify-center whitespace-nowrap"
                  >
                    Upload Image
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Provide a URL or upload from your device. Leave blank to use your initial.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                <textarea 
                  value={editForm.bio} 
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
                  placeholder="A short bio about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                  <input 
                    type="text" 
                    value={editForm.location} 
                    onChange={e => setEditForm({...editForm, location: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Company</label>
                  <input 
                    type="text" 
                    value={editForm.company} 
                    onChange={e => setEditForm({...editForm, company: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Workplace"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Personal Website</label>
                <input 
                  type="text" 
                  value={editForm.website} 
                  onChange={e => setEditForm({...editForm, website: e.target.value})}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="https://yourdomain.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">GitHub Username</label>
                  <input 
                    type="text" 
                    value={editForm.github} 
                    onChange={e => setEditForm({...editForm, github: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Twitter/X Username</label>
                  <input 
                    type="text" 
                    value={editForm.twitter} 
                    onChange={e => setEditForm({...editForm, twitter: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            </form>

            <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
