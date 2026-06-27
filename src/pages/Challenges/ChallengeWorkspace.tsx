import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getChallenge, setPlayerReady, updatePlayerStatus, pingChallengeConnection, forfeitChallenge } from '../../store/slices/challengeSlice';
import { problemService } from '../../services/problems';
import { Problem, ExecutionResult } from '../../types';
import { codeExecutionService } from '../../services/execution';
import { authService } from '../../services/auth';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Swords, Trophy, Copy, CheckCircle2, Clock, Flag, Wifi, WifiOff, AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';

const ALL_LANGUAGES = ['python', 'java', 'c', 'cpp', 'javascript', 'typescript', 'go', 'rust', 'php', 'kotlin', 'csharp', 'ruby'];

const ChallengeWorkspace: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const challenge = useSelector((state: RootState) => state.challenge.activeChallenge);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [opponentName, setOpponentName] = useState<string>('Opponent');
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load problem and challenge
  useEffect(() => {
    if (challengeId) {
      dispatch(getChallenge(challengeId));
    }
  }, [challengeId, dispatch]);

  useEffect(() => {
    if (challenge && !problem) {
      problemService.getProblems().then(problems => {
        const p = problems.find(pr => pr.id === challenge.problemId);
        if (p) {
          setProblem(p);
          // Set initial language
          if (challenge.allowedLanguages && challenge.allowedLanguages.length > 0 && challenge.allowedLanguages[0] !== '*') {
            const firstAllowed = challenge.allowedLanguages[0].toLowerCase();
            if (firstAllowed === 'c++') setLanguage('cpp');
            else if (firstAllowed === 'c#') setLanguage('csharp');
            else setLanguage(firstAllowed);
          }
          setCode(p.starterCode[language] || '');
        }
      });
    }
  }, [challenge, problem, language]);

  // Fetch immediately on mount to clear old state, and start polling
  useEffect(() => {
    if (!challengeId) return;
    
    // Initial fetch to make sure we have the right challenge
    dispatch(getChallenge(challengeId));

    // Polling interval
    if (challenge?.id === challengeId && challenge?.status !== 'COMPLETED' && challenge?.status !== 'FORFEITED') {
      pollInterval.current = setInterval(() => {
        dispatch(getChallenge(challengeId));
      }, 2000);

      if (user?.id) {
        pingInterval.current = setInterval(() => {
          dispatch(pingChallengeConnection({ challengeId, userId: user.id }));
        }, 5000);
      }
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      if (pingInterval.current) clearInterval(pingInterval.current);
    };
  }, [challengeId, challenge?.id, challenge?.status, user?.id, dispatch]);

  // Handle Countdown when both are ready
  useEffect(() => {
    if (challenge?.status === 'ACTIVE' && countdown === null && challenge.createdAt) {
      // If challenge just became active, start countdown
      // In a real app we'd trigger this event once.
      // For localstorage, if it's ACTIVE but we haven't started timer yet:
      setCountdown(3);
    }
  }, [challenge?.status, countdown]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle match timer
  useEffect(() => {
    if (challenge?.status === 'ACTIVE' && countdown === 0) {
      // Challenge started, start timer
      const endTime = challenge.createdAt + challenge.duration; // Rough approximation for local
      timerInterval.current = setInterval(() => {
        const now = Date.now();
        const diff = endTime - now;
        if (diff <= 0) {
          setTimeRemaining('00:00');
          clearInterval(timerInterval.current!);
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [challenge?.status, countdown, challenge?.createdAt, challenge?.duration]);

  // Fetch opponent name
  useEffect(() => {
    if (challenge && user) {
      const oppId = challenge.player1Id === user.id ? challenge.player2Id : challenge.player1Id;
      if (oppId) {
        authService.getUser(oppId).then(u => {
          if (u) setOpponentName(u.username);
        });
      }
    }
  }, [challenge, user]);

  const copyInvite = () => {
    if (challenge) {
      navigator.clipboard.writeText(challenge.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle auto-redirect on Forfeit
  useEffect(() => {
    if (challenge?.status === 'FORFEITED') {
      setRedirectCountdown(5);
    }
  }, [challenge?.status]);

  useEffect(() => {
    if (redirectCountdown !== null && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0) {
      navigate('/challenges');
    }
  }, [redirectCountdown, navigate]);

  const handleReady = () => {
    if (challenge && user) {
      dispatch(setPlayerReady({ challengeId: challenge.id, userId: user.id, ready: true }));
    }
  };

  const handleForfeit = () => {
    if (challenge && user && window.confirm("Are you sure you want to forfeit? This will count as a loss.")) {
      dispatch(forfeitChallenge({ challengeId: challenge.id, userId: user.id }));
    }
  };

  const handleRunCode = async (isSubmit: boolean = false) => {
    if (!problem || !user || !challenge) {
      console.error("Cannot run code. Missing dependencies:", { problem, user, challenge });
      return;
    }
    
    setIsRunning(true);
    setResult(null);

    try {
      const res = await codeExecutionService.runCode({
        code,
        language,
        testCases: problem.testCases || [],
        isSubmit,
      });

      setResult(res);

      if (isSubmit && res.status === 'Accepted') {
        const execTime = res.runtime;
        const subTime = Date.now();
        await dispatch(updatePlayerStatus({
          challengeId: challenge.id,
          userId: user.id,
          status: 'Solved',
          execTime,
          subTime
        }));
      }

    } catch (err: any) {
      console.error("Error executing code:", err);
      setResult({
        status: "Compilation Error",
        runtime: 0,
        memory: 0,
        output: "",
        expectedOutput: "",
        passedCases: 0,
        totalCases: problem.testCases?.length || 0,
        errorMessage: err.message || "Execution failed",
      });
    } finally {
      setIsRunning(false);
    }
  };

  if (challengeId === "undefined") {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background gap-4">
        <h2 className="text-2xl font-bold text-foreground">Invalid Challenge</h2>
        <p className="text-muted-foreground">This challenge was not created properly.</p>
        <button 
          onClick={() => navigate('/challenges')}
          className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!challenge || !user || challenge.id !== challengeId) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <div className="text-muted-foreground font-medium">Loading challenge data...</div>
      </div>
    );
  }

  const isPlayer1 = challenge.player1Id === user.id;
  const amIReady = isPlayer1 ? challenge.player1Ready : challenge.player2Ready;
  const isOpponentReady = isPlayer1 ? challenge.player2Ready : challenge.player1Ready;
  const opponentStatus = isPlayer1 ? challenge.player2Status : challenge.player1Status;
  const myConnection = isPlayer1 ? challenge.player1Connection : challenge.player2Connection;
  const opponentConnection = isPlayer1 ? challenge.player2Connection : challenge.player1Connection;

  // Language Filtering
  const availableLanguages = challenge.allowedLanguages?.includes('*') 
    ? ALL_LANGUAGES 
    : challenge.allowedLanguages?.map(l => l.toLowerCase() === 'c++' ? 'cpp' : l.toLowerCase() === 'c#' ? 'csharp' : l.toLowerCase()) || [];

  // Render Waiting Lobby
  if (challenge.status === 'WAITING' || (challenge.status === 'ACTIVE' && countdown !== 0)) {
    return (
      <div className="flex flex-col h-screen bg-background relative overflow-hidden">
        {/* Main Application Navbar */}
        <div className="flex-none">
          <Navbar />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-lg w-full text-center relative overflow-hidden">
            {countdown !== null ? (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-4 text-orange-500">Match Starts In</h2>
              <div className="text-9xl font-black text-foreground drop-shadow-2xl">
                {countdown > 0 ? countdown : 'GO!'}
              </div>
            </div>
          ) : null}

          <div className="p-4 bg-orange-500/10 text-orange-500 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <Swords className="w-10 h-10" />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mx-auto">{challenge.challengeName}</h1>
          </div>
          {challenge.challengeMessage && (
            <div className="bg-secondary/50 p-4 rounded-xl text-muted-foreground italic text-sm mt-4">
              "{challenge.challengeMessage}"
            </div>
          )}
          
          {!challenge.player2Id ? (
            <div className="my-8">
              <p className="text-muted-foreground mb-4">Waiting for opponent to join...</p>
              <div className="bg-secondary/30 border border-border rounded-xl p-4 shadow-sm inline-block">
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-widest">Invite Code</p>
                <div 
                  onClick={copyInvite}
                  className="text-3xl font-mono font-bold text-foreground tracking-[0.2em] cursor-pointer hover:text-orange-500 transition-colors flex items-center justify-center gap-3"
                >
                  {challenge.inviteCode}
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>
            </div>
          ) : (
            <div className="my-8 space-y-4">
              <h3 className="text-xl font-bold mb-6 text-foreground">Versus</h3>
              
              {/* Player 1 Status */}
              <div className="flex justify-between items-center bg-secondary/30 p-6 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-xl font-bold text-foreground">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-foreground">{user.username}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                    </div>
                  </div>
                </div>
                <div>
                  {!amIReady ? (
                    <button 
                      onClick={handleReady}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25"
                    >
                      I'm Ready
                    </button>
                  ) : (
                    <div className="bg-secondary/50 text-foreground font-bold py-3 px-8 rounded-xl border border-border">
                      Waiting for opponent...
                    </div>
                  )}
                </div>
              </div>

              <div className="text-2xl font-black text-foreground my-2">VS</div>

              {/* Player 2 Status */}
              <div className="flex justify-between items-center bg-secondary/30 p-6 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-xl font-bold text-foreground relative">
                    {opponentName.charAt(0).toUpperCase()}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                      opponentConnection === 'Online' ? 'bg-green-500' :
                      opponentConnection === 'Reconnecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                    }`} title={opponentConnection} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-foreground">{opponentName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        opponentConnection === 'Online' ? 'bg-green-500' :
                        opponentConnection === 'Reconnecting' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span> {opponentConnection}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-secondary/50 font-bold py-3 px-8 rounded-xl border border-border min-w-[160px]">
                    {isOpponentReady ? (
                      <span className="text-green-500">Ready</span>
                    ) : (
                      <span className="text-muted-foreground">Waiting...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Difficulty: <strong className="text-foreground">{challenge.difficulty}</strong></span>
              <span>Duration: <strong className="text-foreground">{challenge.duration / 60000} mins</strong></span>
            </div>
            
            <button 
              onClick={handleForfeit}
              className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors mt-2 underline"
            >
              Cancel & Leave Challenge
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  // Render Completed Modal Overlay
  const renderEndModal = () => {
    if (challenge.status !== 'COMPLETED' && challenge.status !== 'FORFEITED') return null;
    const iWon = challenge.winnerId === user.id;

    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${iWon ? 'bg-green-500' : 'bg-red-500'}`} />
          
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${iWon ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            <Trophy className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-black mb-2">{iWon ? 'VICTORY' : 'DEFEAT'}</h2>
          <p className="text-muted-foreground mb-8">
            {challenge.status === 'FORFEITED' 
              ? (iWon ? `${opponentName} forfeited the challenge or disconnected.` : 'You forfeited the challenge.') 
              : (iWon ? 'You were the first to solve the problem!' : `${opponentName} solved it first.`)}
          </p>

          <div className="space-y-3 text-left bg-secondary/30 p-4 rounded-xl mb-8">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Winner</span>
              <span className="font-bold">{iWon ? user.username : opponentName}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Problem</span>
              <span className="font-medium text-right">{problem?.title}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Language</span>
              <span className="font-medium">{language}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/challenges')}
              className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-3 rounded-xl font-bold transition-colors"
            >
              Back to Lobby
            </button>
            <button 
              onClick={() => navigate('/challenges/create')}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors"
            >
              Rematch
            </button>
          </div>
          
          {redirectCountdown !== null && challenge.status === 'FORFEITED' && (
            <p className="text-muted-foreground text-sm mt-6 animate-pulse">
              Redirecting to dashboard in {redirectCountdown}s...
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background relative">
      {renderEndModal()}
      
      {/* Active Top Bar */}
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/challenges')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Leave Challenge"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-bold hidden sm:block">{problem?.title}</div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="font-mono font-bold">{timeRemaining || '00:00'}</span>
          </div>

          <div className="flex items-center gap-3 bg-secondary/30 border border-border px-4 py-1.5 rounded-lg">
            <span className="text-sm font-medium">{opponentName}</span>
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              opponentConnection === 'Online' ? 'text-green-500' :
              opponentConnection === 'Reconnecting' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {opponentConnection === 'Online' ? <Wifi className="w-3 h-3" /> : 
               opponentConnection === 'Reconnecting' ? <AlertTriangle className="w-3 h-3 animate-pulse" /> :
               <WifiOff className="w-3 h-3" />}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              opponentStatus === 'Solved' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
            }`}>
              {opponentStatus}
            </span>
          </div>

          <button onClick={handleForfeit} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors" title="Forfeit Challenge">
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Description */}
        <div className="w-1/2 border-r border-border flex flex-col bg-card overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold">{problem?.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                problem?.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                problem?.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {problem?.difficulty}
              </span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: problem?.description || '' }} />
            
            {/* Test Cases display omitted for brevity, similar to RoomWorkspace */}
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="w-1/2 flex flex-col bg-background">
          <div className="h-12 border-b border-border flex items-center px-4 bg-card z-10">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-secondary/50 border border-border text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-orange-500 font-medium"
            >
              {availableLanguages.map(l => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 border-b border-border relative">
            <Editor
              height="100%"
              language={language.toLowerCase()}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Console / Output */}
          <div className="h-64 bg-card flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <div className="text-sm font-semibold">Console</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunCode(false)}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
                >
                  <Play className="w-4 h-4" /> Run
                </button>
                <button
                  onClick={() => handleRunCode(true)}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm font-medium shadow-md shadow-orange-500/20"
                >
                  <Send className="w-4 h-4" /> Submit
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
              {isRunning ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Running code...
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className={`font-bold text-lg ${result.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                    {result.status}
                  </div>
                  <div className="flex gap-4 text-muted-foreground">
                    <div>Runtime: {result.runtime} ms</div>
                    <div>Memory: {result.memory} MB</div>
                    <div>Passed: {result.passedCases}/{result.totalCases}</div>
                  </div>
                  {result.errorMessage && (
                    <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mt-4 whitespace-pre-wrap">
                      {result.errorMessage}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Run or submit code to see results. First to submit an Accepted solution wins!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeWorkspace;
