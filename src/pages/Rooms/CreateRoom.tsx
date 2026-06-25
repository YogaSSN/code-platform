import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom } from '../../store/slices/roomSlice';
import { AppDispatch, RootState } from '../../store';
import { Settings, Plus, Search, X, CheckCircle2, ChevronRight, ChevronLeft, Edit2, Check, Eye, ShieldAlert } from 'lucide-react';
import { Problem, RoomProblem } from '../../types';
import { problemService } from '../../services/problems';
import { useActiveSession } from '../../hooks/useActiveSession';

const LANGUAGES = ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'PHP', 'Kotlin', 'C#', 'Ruby'];

const CreateRoom: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  
  // Step 1: Basic Details
  const [roomName, setRoomName] = useState('');
  const [durationValue, setDurationValue] = useState(60);
  const [durationUnit, setDurationUnit] = useState<'Minutes' | 'Hours'>('Minutes');

  // Step 2: Room Settings
  const [chatEnabled, setChatEnabled] = useState(true);
  const [leaderboardVisibility, setLeaderboardVisibility] = useState<"LIVE" | "HIDDEN">("LIVE");
  const [allowedLanguages, setAllowedLanguages] = useState<string[]>(LANGUAGES);

  // Step 3 & 4: Problem State
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomProblems, setRoomProblems] = useState<RoomProblem[]>([]);
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  
  // Step 5: Spectators
  const [allowSpectators, setAllowSpectators] = useState(false);

  // Generic State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    problemService.getProblems().then(setAllProblems);
  }, []);

  const handleLanguageToggle = (lang: string) => {
    setAllowedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const addProblem = (p: Problem) => {
    setRoomProblems(prev => [...prev, { ...p, roomId: 'pending' }]);
    setSearchQuery('');
  };

  const removeProblem = (id: string) => {
    setRoomProblems(prev => prev.filter(p => p.id !== id));
    if (editingProblemId === id) setEditingProblemId(null);
  };

  const updateRoomProblem = (id: string, field: string, value: string) => {
    setRoomProblems(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const calculateDurationMs = () => {
    return durationValue * (durationUnit === 'Hours' ? 60 * 60 * 1000 : 60 * 1000);
  };

  const handleCreate = async () => {
    if (!roomName.trim()) return setError('Room name is required');
    if (roomProblems.length === 0) return setError('Select at least one problem');
    
    setIsLoading(true);
    setError('');
    
    try {
      const action = await dispatch(createRoom({ 
        hostId: user!.id, 
        hostName: user!.username,
        name: roomName, 
        durationMs: calculateDurationMs(),
        leaderboardVisibility,
        chatEnabled,
        allowedLanguages,
        allowSpectators,
        problems: roomProblems 
      })).unwrap();
      
      navigate(`/rooms/${action.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create room.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep1 = () => {
    if (!roomName) return "Room name is required.";
    if (durationValue < (durationUnit === 'Minutes' ? 5 : 0.1)) return "Duration must be at least 5 minutes.";
    return null;
  };

  const validateStep2 = () => {
    if (allowedLanguages.length === 0) return "Select at least one allowed language.";
    return null;
  };

  const nextStep = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) return setError(err);
    }
    if (step === 3 && roomProblems.length === 0) return setError("Please select at least one problem.");
    
    setError('');
    setStep(prev => (prev + 1) as any);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => (prev - 1) as any);
  };

  const filteredGlobalProblems = allProblems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !roomProblems.find(rp => rp.id === p.id)
  );

  const { sessionType, activeChallenge } = useActiveSession();

  if (sessionType === 'CHALLENGE') {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-card border border-border rounded-md text-center">
        <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Challenge in Progress</h1>
        <p className="text-muted-foreground mb-8">You cannot create a room while participating in an active 1 vs 1 Challenge.</p>
        <button onClick={() => navigate(`/challenges/${activeChallenge?.id}`)} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors">Resume Challenge</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 mt-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Create Private Room</h1>
        
        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-border rounded-full z-0"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-primary rounded-full z-0 transition-all duration-300" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
          
          <div className="relative z-10 flex justify-between">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                step >= i ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-background' : 'bg-secondary text-muted-foreground border border-border'
              }`}>
                {step > i ? <Check className="w-4 h-4" /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className={step >= 1 ? 'text-foreground' : ''}>Basics</span>
            <span className={step >= 2 ? 'text-foreground' : ''}>Settings</span>
            <span className={step >= 3 ? 'text-foreground' : ''}>Problems</span>
            <span className={step >= 4 ? 'text-foreground' : ''}>Customize</span>
            <span className={step >= 5 ? 'text-foreground' : ''}>Spectators</span>
            <span className={step >= 6 ? 'text-foreground' : ''}>Review</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md p-6 md:p-8 shadow-sm min-h-[500px] flex flex-col relative overflow-hidden">
        {error && <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md font-medium">{error}</div>}

        {/* STEP 1: BASIC DETAILS */}
        {step === 1 && (
          <div className="space-y-8 flex-grow">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Settings className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-foreground">Basic Details</h2>
            </div>
            
            <div className="space-y-2 max-w-2xl">
              <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">Room Name</label>
              <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="e.g., Google Fall Placement Round 1" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-lg" />
              <p className="text-xs text-muted-foreground">This name will be visible to all participants.</p>
            </div>

            <div className="space-y-2 max-w-2xl">
              <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">Duration</label>
              <div className="flex gap-4">
                <input type="number" min="1" value={durationValue} onChange={e => setDurationValue(Number(e.target.value))} className="w-1/3 bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-lg text-center font-mono" />
                <select value={durationUnit} onChange={e => setDurationUnit(e.target.value as any)} className="w-2/3 bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-lg">
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                </select>
              </div>
              <p className="text-xs text-muted-foreground">The room will automatically close submissions when time expires.</p>
            </div>
          </div>
        )}

        {/* STEP 2: ROOM SETTINGS */}
        {step === 2 && (
          <div className="space-y-8 flex-grow">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Settings className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-foreground">Room Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary/20 p-5 rounded-2xl border border-border space-y-3">
                <label className="block text-sm font-bold uppercase tracking-widest text-foreground">Leaderboard Visibility</label>
                <div className="flex gap-3">
                  <button onClick={() => setLeaderboardVisibility("LIVE")} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${leaderboardVisibility === "LIVE" ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:border-muted"}`}>Live</button>
                  <button onClick={() => setLeaderboardVisibility("HIDDEN")} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${leaderboardVisibility === "HIDDEN" ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:border-muted"}`}>Hidden</button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Hidden leaderboards are only visible to the host until the room ends, preventing participants from seeing each other's progress.</p>
              </div>

              <div className="bg-secondary/20 p-5 rounded-2xl border border-border space-y-3">
                <label className="block text-sm font-bold uppercase tracking-widest text-foreground">Room Chat</label>
                <div className="flex gap-3">
                  <button onClick={() => setChatEnabled(true)} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${chatEnabled ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:border-muted"}`}>Enabled</button>
                  <button onClick={() => setChatEnabled(false)} className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold ${!chatEnabled ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:border-muted"}`}>Disabled</button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">If disabled, the announcements feed will be strictly one-way (host to participants). If enabled, participants can send messages.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">Language Restrictions</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {LANGUAGES.map(lang => (
                  <button 
                    key={lang} 
                    onClick={() => handleLanguageToggle(lang)}
                    className={`py-3 text-sm rounded-xl border-2 transition-all font-bold ${allowedLanguages.includes(lang) ? 'bg-primary/10 text-primary border-primary' : 'bg-background border-border text-muted-foreground hover:border-muted'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 border-t border-border pt-4">
                <button onClick={() => setAllowedLanguages(LANGUAGES)} className="text-sm font-bold text-primary hover:underline">Select All</button>
                <button onClick={() => setAllowedLanguages([])} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Deselect All</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROBLEM SELECTION */}
        {step === 3 && (
          <div className="flex-grow flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Search className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-foreground">Select Problems</h2>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Search global problem library..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-background border-2 border-border rounded-2xl focus:outline-none focus:border-primary transition-colors text-lg" />
              
              {searchQuery && (
                <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
                  {filteredGlobalProblems.length > 0 ? filteredGlobalProblems.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 hover:bg-secondary cursor-pointer border-b border-border/50 last:border-0" onClick={() => addProblem(p)}>
                      <div>
                        <div className="font-bold text-foreground mb-1">{p.title}</div>
                        <div className={`text-xs font-bold uppercase tracking-wider ${p.difficulty === 'Easy' ? 'text-emerald-500' : p.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>{p.difficulty}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"><Plus className="w-4 h-4" /></div>
                    </div>
                  )) : (
                    <div className="p-6 text-center text-muted-foreground font-medium">No problems found matching "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto bg-secondary/10 rounded-2xl border border-border p-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Selected Problems ({roomProblems.length})</h3>
              {roomProblems.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-background">
                  <Search className="w-8 h-8 mb-3 opacity-50" />
                  <p className="font-medium">Search and add problems above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {roomProblems.map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-background border border-border shadow-sm rounded-xl group hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 flex items-center justify-center bg-secondary rounded-lg font-bold text-muted-foreground group-hover:text-foreground">{idx + 1}</span>
                        <span className="font-bold text-foreground">{p.title}</span>
                      </div>
                      <button onClick={() => removeProblem(p.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: PROBLEM CUSTOMIZATION */}
        {step === 4 && (
          <div className="flex-grow flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Edit2 className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-foreground">Customize Problems</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 bg-secondary/30 p-4 rounded-xl border border-border">Modifications made here will only affect this room. The original global problem in the main library remains untouched. This is useful for preventing participants from Googling problem titles.</p>
            
            <div className="flex gap-6 h-full overflow-hidden">
              <div className="w-1/3 border-r border-border pr-4 overflow-y-auto space-y-2">
                {roomProblems.map((p, idx) => (
                  <button 
                    key={p.id}
                    onClick={() => setEditingProblemId(p.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${editingProblemId === p.id ? 'bg-primary/10 border-primary' : 'bg-background border-border hover:border-primary/30'}`}
                  >
                    <span className={`truncate font-bold text-sm ${editingProblemId === p.id ? 'text-primary' : 'text-foreground'}`}>{idx + 1}. {p.title}</span>
                    <Edit2 className={`w-4 h-4 shrink-0 transition-opacity ${editingProblemId === p.id ? 'text-primary opacity-100' : 'text-muted-foreground opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>

              <div className="w-2/3 pl-2 overflow-y-auto">
                {!editingProblemId ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center border-2 border-dashed border-border rounded-md bg-secondary/10">
                    <Edit2 className="w-12 h-12 mb-4 opacity-20" />
                    <span className="font-medium text-lg">Select a problem from the left</span>
                    <span className="text-sm">to customize its details for this room.</span>
                  </div>
                ) : (
                  <div className="space-y-6 pb-8">
                    {(() => {
                      const ep = roomProblems.find(p => p.id === editingProblemId)!;
                      return (
                        <>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">Custom Title</label>
                            <input type="text" value={ep.title} onChange={e => updateRoomProblem(ep.id, 'title', e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">Difficulty Override</label>
                            <select value={ep.difficulty} onChange={e => updateRoomProblem(ep.id, 'difficulty', e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-foreground focus:ring-2 focus:ring-primary focus:outline-none">
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">Custom Description (Markdown)</label>
                            <textarea value={ep.description} onChange={e => updateRoomProblem(ep.id, 'description', e.target.value)} rows={10} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary focus:outline-none leading-relaxed" />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: SPECTATOR SETTINGS */}
        {step === 5 && (
          <div className="space-y-8 flex-grow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Spectators Access</h3>
                <p className="text-sm text-muted-foreground">Allow others to watch the contest without participating</p>
              </div>
            </div>

            <div className="bg-secondary/30 border border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setAllowSpectators(!allowSpectators)}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Enable Spectators</h4>
                  <p className="text-sm text-muted-foreground mt-1">Generates a separate invite code for spectators</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${allowSpectators ? 'bg-primary' : 'bg-border'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${allowSpectators ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
              
              {allowSpectators && (
                <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                    Spectators will not appear on the leaderboard and cannot submit solutions. They can view the leaderboard and chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW SUMMARY */}
        {step === 6 && (
          <div className="flex-grow space-y-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><CheckCircle2 className="w-5 h-5" /></div>
              <h2 className="text-2xl font-bold text-foreground">Review & Create</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-background border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                  <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Core Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm">Room Name</span><span className="font-bold text-foreground text-lg text-right">{roomName}</span></div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground text-sm">Spectators</span>
                      <span className="font-medium text-foreground">{allowSpectators ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm">Duration</span><span className="font-bold text-foreground">{durationValue} {durationUnit}</span></div>
                  </div>
                </div>

                <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Features</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm">Leaderboard</span><span className="font-bold text-foreground bg-secondary px-2 py-0.5 rounded text-xs">{leaderboardVisibility}</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground text-sm">Room Chat</span><span className="font-bold text-foreground bg-secondary px-2 py-0.5 rounded text-xs">{chatEnabled ? 'ENABLED' : 'DISABLED'}</span></div>
                    <div>
                      <span className="block text-muted-foreground text-sm mb-2">Allowed Languages</span>
                      <div className="flex flex-wrap gap-1.5">
                        {allowedLanguages.map(l => <span key={l} className="text-[10px] font-bold uppercase tracking-wider bg-background border border-border px-2 py-1 rounded">{l}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Problems ({roomProblems.length})</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {roomProblems.map((p, idx) => (
                    <div key={p.id} className="flex justify-between items-center bg-secondary/30 p-3 rounded-xl border border-border/50">
                      <span className="font-bold text-sm text-foreground">{idx + 1}. {p.title}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' : p.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>{p.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION FOOTER */}
        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center relative z-10 bg-card">
          {step > 1 ? (
            <button onClick={prevStep} className="px-6 py-3 bg-secondary text-foreground rounded-md font-bold hover:bg-secondary/80 transition-colors flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : <div></div>}

          {step < 6 ? (
            <button onClick={nextStep} className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleCreate} disabled={isLoading} className="px-10 py-4 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-3 text-lg">
              {isLoading ? 'Creating Arena...' : <><CheckCircle2 className="w-6 h-6" /> Create Arena & Generate Codes</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
