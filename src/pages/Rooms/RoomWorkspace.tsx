import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { roomService } from '../../services/rooms';
import { problemService } from '../../services/problems';
import { codeExecutionService } from '../../services/execution';
import { Room, RoomProblem, ExecutionResult } from '../../types';
import Split from 'react-split';
import Editor from '@monaco-editor/react';
import { Play, Send, ArrowLeft, TerminalSquare } from 'lucide-react';

const RoomWorkspace: React.FC = () => {
  const { roomId, slug } = useParams<{ roomId: string, slug: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [room, setRoom] = useState<Room | null>(null);
  const [problem, setProblem] = useState<RoomProblem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  
  useEffect(() => {
    const fetchContext = async () => {
      if (!roomId || !slug) return;
      
      const roomData = await roomService.getRoom(roomId);
      if (!roomData || roomData.status === 'ENDED' || Date.now() > roomData.endTime) {
        navigate(`/rooms/${roomId}`);
        return;
      }
      setRoom(roomData);
      
      const prob = roomData.problems.find(p => p.slug === slug);
      if (!prob) {
        navigate(`/rooms/${roomId}`);
        return;
      }
      setProblem(prob);
      
      const defaultLang = roomData.allowedLanguages[0] || 'JavaScript';
      if (!roomData.allowedLanguages.includes(language)) {
        setLanguage(defaultLang);
      }
      
      setCode(prob.starterCode[language] || prob.starterCode[defaultLang] || '// Write your code here');
    };
    
    fetchContext();
  }, [roomId, slug, language, navigate]);

  const handleRunCode = async (isSubmit = false) => {
    if (!problem) return;
    setIsExecuting(true);
    setResult(null);
    try {
      // In a real environment, this tracks submission for leaderboard points
      // We pass the roomId so the backend can link it.
      const res = await codeExecutionService.runCode({
        code,
        language,
        testCases: problem.testCases,
        isSubmit
      });
      setResult(res);
      
      // If success submit, we would normally dispatch leaderboard update here
      if (isSubmit && res.status === 'Accepted' && user && room) {
        await roomService.markProblemSolved(room.id, user.id, problem.id, 100);
      }
      
    } catch (err: any) {
      setResult({
        status: "Runtime Error",
        runtime: 0,
        memory: 0,
        output: err.message,
        expectedOutput: "",
        passedCases: 0,
        totalCases: problem.testCases.length
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!room || !problem) return <div className="h-screen flex items-center justify-center text-muted-foreground">Loading Room Environment...</div>;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Workspace Header - Specialized for Room */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/rooms/${roomId}`} className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-sm flex items-center gap-2">
              <span className="text-primary tracking-widest text-xs font-mono uppercase bg-primary/10 px-2 py-0.5 rounded">CONTEST</span>
              {problem.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)}
            disabled={user?.id === room.hostId}
            className="bg-secondary border-none text-sm rounded-md py-1.5 px-3 focus:ring-0 cursor-pointer text-foreground disabled:opacity-50"
          >
            {room.allowedLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          
          {user?.id !== room.hostId ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleRunCode(false)}
                disabled={isExecuting}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" /> Run
              </button>
              <button
                onClick={() => handleRunCode(true)}
                disabled={isExecuting}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Submit
              </button>
            </div>
          ) : (
            <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-md text-sm font-medium border border-primary/20">
              Host View (Read Only)
            </div>
          )}
        </div>
      </header>

      {/* Main Split Layout */}
      <Split 
        className="flex-grow flex w-full overflow-hidden" 
        sizes={[45, 55]} 
        minSize={[300, 400]}
        gutterSize={6}
      >
        {/* Left Panel: Description */}
        <div className="bg-card flex flex-col h-full overflow-y-auto custom-scrollbar p-6">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <div className="prose prose-invert max-w-none text-muted-foreground mb-8 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: problem.description }} />
          
          <div className="space-y-6">
            {problem.examples.map((ex, i) => (
              <div key={ex.id} className="bg-secondary/30 p-4 rounded-md border border-border">
                <p className="font-bold text-foreground mb-3 text-sm">Example {i + 1}:</p>
                <div className="font-mono text-sm space-y-1">
                  <p><span className="text-muted-foreground select-none">Input: </span>{ex.input}</p>
                  <p><span className="text-muted-foreground select-none">Output: </span>{ex.output}</p>
                  {ex.explanation && <p className="mt-2 text-muted-foreground"><span className="text-muted-foreground select-none">Explanation: </span>{ex.explanation}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Editor & Console */}
        <div className="h-full flex flex-col">
          <Split
            direction="vertical"
            sizes={[70, 30]}
            minSize={[200, 100]}
            gutterSize={6}
            className="flex-grow flex flex-col overflow-hidden"
          >
            <div className="flex-grow bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  readOnly: user?.id === room.hostId,
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              />
            </div>
            
            {/* Console */}
            <div className="bg-card border-t border-border flex flex-col">
              <div className="px-4 py-2 bg-secondary/50 border-b border-border flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TerminalSquare className="w-4 h-4" /> Console Output
              </div>
              <div className="p-4 flex-grow overflow-y-auto custom-scrollbar font-mono text-sm">
                {!result && !isExecuting && <span className="text-muted-foreground">Run your code to see the output here.</span>}
                {isExecuting && <span className="text-primary animate-pulse">Running code on secure remote container...</span>}
                {result && !isExecuting && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold ${result.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                      {result.status}
                    </h3>
                    <div className="flex gap-6 text-muted-foreground">
                      <span>Runtime: <strong className="text-foreground">{result.runtime} ms</strong></span>
                      <span>Memory: <strong className="text-foreground">{result.memory} MB</strong></span>
                      <span>Cases: <strong className="text-foreground">{result.passedCases}/{result.totalCases}</strong></span>
                    </div>
                    {result.status !== 'Accepted' && (
                      <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mt-4 whitespace-pre-wrap">
                        {result.output}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Split>
        </div>
      </Split>
    </div>
  );
};

export default RoomWorkspace;
