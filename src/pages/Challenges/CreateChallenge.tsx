import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Swords, Clock, AlertCircle, ChevronLeft, ChevronRight, Check, CheckCircle2, MessageSquare, Code2, ShieldAlert } from 'lucide-react';
import { createChallenge } from '../../store/slices/challengeSlice';
import { AppDispatch, RootState } from '../../store';
import { useActiveSession } from '../../hooks/useActiveSession';

const LANGUAGES = ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'PHP', 'Kotlin', 'C#', 'Ruby'];

const CreateChallenge: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [error, setError] = useState('');

  // Fields
  const [challengeName, setChallengeName] = useState('');
  const [durationValue, setDurationValue] = useState(15);
  const [durationUnit, setDurationUnit] = useState<'Minutes' | 'Hours'>('Minutes');
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "Mixed">("Medium");
  const [languagePolicy, setLanguagePolicy] = useState<'ANY' | 'RESTRICTED'>('ANY');
  const [allowedLanguages, setAllowedLanguages] = useState<string[]>(LANGUAGES);
  const [challengeMessage, setChallengeMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isBusy, sessionType, activeRoom, activeChallenge } = useActiveSession();

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
            ? 'You cannot create a challenge while participating in a Private Room.' 
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

  const handleLanguageToggle = (lang: string) => {
    if (allowedLanguages.includes(lang)) {
      setAllowedLanguages(allowedLanguages.filter(l => l !== lang));
    } else {
      setAllowedLanguages([...allowedLanguages, lang]);
    }
  };

  const calculateDurationMs = () => {
    return durationUnit === 'Minutes' ? durationValue * 60 * 1000 : durationValue * 60 * 60 * 1000;
  };

  const nextStep = () => {
    if (step === 2) {
      if (durationValue < (durationUnit === 'Minutes' ? 5 : 0.1)) {
        return setError("Duration must be at least 5 minutes.");
      }
    }
    if (step === 4 && languagePolicy === 'RESTRICTED' && allowedLanguages.length === 0) {
      return setError("Select at least one allowed language.");
    }
    
    setError('');
    setStep((prev) => (prev + 1) as any);
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => (prev - 1) as any);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(createChallenge({
        hostId: user.id,
        challengeName: challengeName || `${user.username}'s Challenge`,
        durationMs: calculateDurationMs(),
        difficulty,
        allowedLanguages: languagePolicy === 'ANY' ? ["*"] : allowedLanguages,
        challengeMessage
      }));
      
      if (createChallenge.fulfilled.match(resultAction)) {
        navigate(`/challenges/${resultAction.payload.id}`);
      } else if (createChallenge.rejected.match(resultAction)) {
        setError(resultAction.error.message || "Failed to create challenge.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 mt-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Create 1 vs 1 Challenge</h1>
        
        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-border rounded-full z-0"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-orange-500 rounded-full z-0 transition-all duration-300" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
          
          <div className="relative z-10 flex justify-between">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                step >= i ? 'bg-orange-500 text-white scale-110 ring-4 ring-background' : 'bg-secondary text-muted-foreground border border-border'
              }`}>
                {step > i ? <Check className="w-4 h-4" /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className={step >= 1 ? 'text-foreground' : ''}>Name</span>
            <span className={step >= 2 ? 'text-foreground' : ''}>Time</span>
            <span className={step >= 3 ? 'text-foreground' : ''}>Difficulty</span>
            <span className={step >= 4 ? 'text-foreground' : ''}>Language</span>
            <span className={step >= 5 ? 'text-foreground' : ''}>Message</span>
            <span className={step >= 6 ? 'text-foreground' : ''}>Review</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-md p-6 md:p-10 shadow-sm min-h-[400px] flex flex-col">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* STEP 1: NAME */}
        {step === 1 && (
          <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Swords className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Challenge Name</h2>
              <p className="text-muted-foreground">Give your duel a catchy title (optional).</p>
            </div>
            
            <input 
              type="text" 
              placeholder={`${user?.username || 'Player'}'s Challenge`}
              value={challengeName}
              onChange={e => setChallengeName(e.target.value)}
              className="w-full text-center text-3xl font-bold bg-transparent border-b-2 border-border focus:border-orange-500 py-4 outline-none transition-colors placeholder:text-muted-foreground/30"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && nextStep()}
            />
          </div>
        )}

        {/* STEP 2: DURATION */}
        {step === 2 && (
          <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Duration</h2>
              <p className="text-muted-foreground">Set custom duration for the battle.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-secondary/30 p-6 rounded-2xl border border-border">
              <input 
                type="number" 
                min={5}
                value={durationValue}
                onChange={e => setDurationValue(Number(e.target.value))}
                className="w-1/2 bg-background border border-border rounded-xl px-4 py-4 text-2xl font-bold text-center focus:outline-none focus:border-orange-500 transition-colors"
              />
              <div className="w-1/2 flex flex-col gap-2">
                <button onClick={() => setDurationUnit('Minutes')} className={`py-3 rounded-xl font-bold border-2 transition-all ${durationUnit === 'Minutes' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-background border-border text-muted-foreground hover:border-orange-500/50'}`}>Minutes</button>
                <button onClick={() => setDurationUnit('Hours')} className={`py-3 rounded-xl font-bold border-2 transition-all ${durationUnit === 'Hours' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-background border-border text-muted-foreground hover:border-orange-500/50'}`}>Hours</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DIFFICULTY */}
        {step === 3 && (
          <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Difficulty</h2>
              <p className="text-muted-foreground">The system randomly selects a problem from the library.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {(["Easy", "Medium", "Hard", "Mixed"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-6 rounded-2xl border-2 font-bold text-lg transition-all ${
                    difficulty === diff 
                      ? 'bg-orange-500/10 border-orange-500 text-orange-500 scale-105 shadow-lg shadow-orange-500/20' 
                      : 'bg-background border-border text-foreground hover:border-orange-500/50 hover:bg-secondary'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: LANGUAGE POLICY */}
        {step === 4 && (
          <div className="flex-grow flex flex-col max-w-3xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Language Policy</h2>
              <p className="text-muted-foreground">Restrict which programming languages can be used.</p>
            </div>
            
            <div className="flex gap-4 mb-8 max-w-md mx-auto w-full">
              <button onClick={() => setLanguagePolicy('ANY')} className={`flex-1 py-4 rounded-xl border-2 transition-all font-bold ${languagePolicy === 'ANY' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-background border-border text-muted-foreground'}`}>Any Language</button>
              <button onClick={() => setLanguagePolicy('RESTRICTED')} className={`flex-1 py-4 rounded-xl border-2 transition-all font-bold ${languagePolicy === 'RESTRICTED' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-background border-border text-muted-foreground'}`}>Restricted</button>
            </div>

            {languagePolicy === 'RESTRICTED' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {LANGUAGES.map(lang => (
                    <button 
                      key={lang} 
                      onClick={() => handleLanguageToggle(lang)}
                      className={`py-3 text-sm rounded-xl border-2 transition-all font-bold ${allowedLanguages.includes(lang) ? 'bg-orange-500/10 text-orange-500 border-orange-500' : 'bg-background border-border text-muted-foreground hover:border-muted'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 border-t border-border pt-4 justify-center">
                  <button onClick={() => setAllowedLanguages(LANGUAGES)} className="text-sm font-bold text-orange-500 hover:underline">Select All</button>
                  <button onClick={() => setAllowedLanguages([])} className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">Deselect All</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: MESSAGE */}
        {step === 5 && (
          <div className="flex-grow flex flex-col justify-center max-w-xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Challenge Message</h2>
              <p className="text-muted-foreground">Leave a message for your opponent (Optional).</p>
            </div>
            
            <textarea 
              placeholder="e.g. Winner buys tea. Let's see who solves this first 😎"
              value={challengeMessage}
              onChange={e => setChallengeMessage(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-xl p-6 text-lg focus:outline-none focus:border-orange-500 transition-colors placeholder:text-muted-foreground/50 resize-none h-40"
            />
          </div>
        )}

        {/* STEP 6: REVIEW */}
        {step === 6 && (
          <div className="flex-grow flex flex-col max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Review & Create</h2>
              <p className="text-muted-foreground">Verify your challenge rules before creating.</p>
            </div>
            
            <div className="bg-secondary/20 border border-border rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Challenge Name</span>
                <span className="font-bold text-foreground">{challengeName || `${user?.username}'s Challenge`}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-bold text-foreground">{durationValue} {durationUnit}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Difficulty</span>
                <span className={`font-bold px-2 py-1 rounded-md text-xs uppercase tracking-wider ${difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' : difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' : 'bg-purple-500/10 text-purple-500'}`}>{difficulty}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Languages</span>
                <span className="font-bold text-foreground">{languagePolicy === 'ANY' ? 'All Languages Allowed' : `${allowedLanguages.length} Selected`}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Message</span>
                <span className="font-medium text-foreground italic">{challengeMessage || 'None'}</span>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION FOOTER */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
          {step > 1 ? (
            <button onClick={prevStep} className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : (
            <button onClick={() => navigate('/challenges')} className="px-6 py-3 font-bold text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          )}

          {step < 6 ? (
            <button onClick={nextStep} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2">
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-70">
              {isSubmitting ? 'Creating...' : 'Create Duel'} <Swords className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
