import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import Editor from '@monaco-editor/react';
import { problemService } from '../services/problems';
import { codeExecutionService } from '../services/execution';
import { submissionService } from '../services/submissions';
import { Problem, ExecutionResult } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Play, Send, CheckCircle2, XCircle, Clock, AlertTriangle, Bookmark as BookmarkIcon } from 'lucide-react';
import { bookmarkService } from '../services/bookmarks';
import { notesService } from '../services/notes';


const languages = ['JavaScript', 'Python', 'Java', 'C++'];

const ProblemWorkspace: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { mode } = useSelector((state: RootState) => state.theme);
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState('JavaScript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'description' | 'solutions' | 'submissions' | 'notes'>('description');
  const [consoleTab, setConsoleTab] = useState<'testcases' | 'result'>('testcases');
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const loadProblem = async () => {
      if (!slug) return;
      const p = await problemService.getProblemBySlug(slug);
      if (p) {
        setProblem(p);
        setCode(p.starterCode[language] || '');
      }
      setLoading(false);
    };
    loadProblem();
  }, [slug]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user && problem) {
        const bookmarked = await bookmarkService.isBookmarked(user.id, problem.id);
        setIsBookmarked(bookmarked);
        const note = await notesService.getNote(user.id, problem.id);
        if (note) setNoteContent(note.content);
      }
    };
    loadUserData();
  }, [user, problem]);

  const toggleBookmark = async () => {
    if (!user || !problem) {
      alert("Please login to bookmark problems.");
      return;
    }
    await bookmarkService.toggleBookmark(user.id, problem.id);
    setIsBookmarked(!isBookmarked);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    if (!user || !problem) return;
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      await notesService.saveNote(user.id, problem.id, newContent);
    }, 1000);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (problem && problem.starterCode[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  };

  const handleRun = async () => {
    if (!problem) return;
    setIsExecuting(true);
    setConsoleTab('result');
    const result = await codeExecutionService.runCode({
      code,
      language,
      testCases: problem.testCases.filter(t => !t.isHidden),
      isSubmit: false
    });
    setExecutionResult(result);
    setIsExecuting(false);
  };

  const handleSubmit = async () => {
    if (!problem || !user) {
      if (!user) alert("Please login to submit code.");
      return;
    }
    setIsExecuting(true);
    setConsoleTab('result');
    const result = await codeExecutionService.runCode({
      code,
      language,
      testCases: problem.testCases,
      isSubmit: true
    });
    
    await submissionService.submit({
      userId: user.id,
      problemId: problem.id,
      code,
      language,
      status: result.status,
      runtime: result.runtime,
      memory: result.memory,
      passedCases: result.passedCases,
      totalCases: result.totalCases
    });
    
    setExecutionResult(result);
    setIsExecuting(false);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;
  if (!problem) return <div className="p-8 text-center text-foreground">Problem not found.</div>;

  return (
    <Split 
      sizes={[40, 60]} 
      minSize={300} 
      gutterSize={6}
      className="flex h-full w-full"
    >
      {/* LEFT PANEL: Description */}
      <div className="h-full bg-card overflow-hidden flex flex-col border-r border-border">
        <div className="flex items-center gap-4 px-4 h-12 border-b border-border bg-secondary/20">
          <button onClick={() => setActiveTab('description')} className={`text-sm font-medium ${activeTab === 'description' ? 'text-primary border-b-2 border-primary h-full' : 'text-muted-foreground hover:text-foreground'}`}>Description</button>
          <button onClick={() => setActiveTab('notes')} className={`text-sm font-medium ${activeTab === 'notes' ? 'text-primary border-b-2 border-primary h-full' : 'text-muted-foreground hover:text-foreground'}`}>Notes</button>
          <button onClick={() => setActiveTab('solutions')} className={`text-sm font-medium ${activeTab === 'solutions' ? 'text-primary border-b-2 border-primary h-full' : 'text-muted-foreground hover:text-foreground'}`}>Solutions</button>
          <button onClick={() => setActiveTab('submissions')} className={`text-sm font-medium ${activeTab === 'submissions' ? 'text-primary border-b-2 border-primary h-full' : 'text-muted-foreground hover:text-foreground'}`}>Submissions</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 prose dark:prose-invert max-w-none">
          {activeTab === 'description' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold m-0">{problem.title}</h1>
                <button 
                  onClick={toggleBookmark}
                  className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary'}`}
                  title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                >
                  <BookmarkIcon className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className={`text-sm font-medium px-2 py-1 rounded-md bg-secondary ${
                  problem.difficulty === 'Easy' ? 'text-easy' : 
                  problem.difficulty === 'Medium' ? 'text-medium' : 'text-hard'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-foreground/90">{problem.description}</div>
              
              <div className="mt-8 space-y-6">
                {problem.examples.map((ex, i) => (
                  <div key={ex.id}>
                    <p className="font-semibold mb-2">Example {i + 1}:</p>
                    <div className="bg-secondary/50 border border-border p-4 rounded-lg font-mono text-sm space-y-2">
                      <div><strong>Input:</strong> {ex.input}</div>
                      <div><strong>Output:</strong> {ex.output}</div>
                      {ex.explanation && <div><strong>Explanation:</strong> {ex.explanation}</div>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <p className="font-semibold mb-2">Constraints:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/80">
                  {problem.constraints.map((c, i) => <li key={i}><code className="bg-secondary px-1 py-0.5 rounded">{c}</code></li>)}
                </ul>
              </div>
            </>
          )}
          {activeTab === 'notes' && (
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">Personal Notes</h2>
              <p className="text-sm text-muted-foreground mb-4">These notes are auto-saved locally and only visible to you.</p>
              <textarea
                value={noteContent}
                onChange={handleNoteChange}
                placeholder="Write your notes here... (Markdown supported mentally)"
                className="flex-grow w-full bg-secondary/20 border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-none custom-scrollbar"
              />
            </div>
          )}
          {activeTab === 'solutions' && <div className="text-muted-foreground">Solutions tab content.</div>}
          {activeTab === 'submissions' && <div className="text-muted-foreground">Log in to view your past submissions.</div>}
        </div>
      </div>

      {/* RIGHT PANEL: Editor & Console */}
      <div className="h-full flex flex-col bg-background">
        {/* Editor Toolbar */}
        <div className="h-10 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="bg-secondary text-foreground text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary border border-border"
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRun}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" /> Run
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Submit
            </button>
          </div>
        </div>

        <Split 
          direction="vertical" 
          sizes={[70, 30]} 
          minSize={100} 
          gutterSize={6}
          className="flex-1 flex flex-col h-full"
        >
          {/* Editor Container */}
          <div className="w-full h-full overflow-hidden relative">
            <Editor
              height="100%"
              language={language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase()}
              theme={mode === 'dark' ? 'vs-dark' : 'light'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                fontLigatures: true,
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Console Area */}
          <div className="h-full bg-card border-t border-border flex flex-col overflow-hidden">
            <div className="flex items-center gap-4 px-4 h-10 border-b border-border bg-secondary/20 shrink-0">
              <button onClick={() => setConsoleTab('testcases')} className={`text-sm font-medium flex items-center gap-2 ${consoleTab === 'testcases' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Test Cases
              </button>
              <button onClick={() => setConsoleTab('result')} className={`text-sm font-medium flex items-center gap-2 ${consoleTab === 'result' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Test Result
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {consoleTab === 'testcases' && (
                <div className="space-y-4">
                  {problem.testCases.filter(t => !t.isHidden).map((tc, idx) => (
                    <div key={idx}>
                      <div className="font-medium text-sm mb-2 text-foreground">Case {idx + 1}</div>
                      <div className="bg-secondary/50 border border-border p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">{tc.input}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {consoleTab === 'result' && (
                <div>
                  {isExecuting ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      Evaluating...
                    </div>
                  ) : executionResult ? (
                    <div className="space-y-4">
                      <h2 className={`text-xl font-bold flex items-center gap-2 ${
                        executionResult.status === 'Accepted' ? 'text-easy' : 'text-destructive'
                      }`}>
                        {executionResult.status === 'Accepted' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                        {executionResult.status}
                      </h2>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Runtime: {executionResult.runtime} ms</div>
                        <div className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Memory: {executionResult.memory} MB</div>
                      </div>
                      
                      <div className="bg-secondary/50 border border-border p-4 rounded-lg font-mono text-sm space-y-3">
                        <div><strong className="text-foreground">Output:</strong><br/>{executionResult.output}</div>
                        <div><strong className="text-foreground">Expected:</strong><br/>{executionResult.expectedOutput}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">Run your code to see results here.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Split>
      </div>
    </Split>
  );
};

export default ProblemWorkspace;
