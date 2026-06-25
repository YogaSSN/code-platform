import React, { useState } from 'react';
import { aiService, LearningPathInput } from '../../services/aiService';
import { Route, Map, ChevronRight, BookOpen, CheckCircle, Code } from 'lucide-react';

const goals = [
  "Amazon SDE",
  "Google SDE",
  "Microsoft",
  "Zoho",
  "TCS",
  "Infosys",
  "Campus Placement",
  "Competitive Programming",
  "Interview Preparation"
];

const LearningPath: React.FC = () => {
  const [goal, setGoal] = useState<string>("Campus Placement");
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const demoInput: LearningPathInput = {
        goal: goal,
        arrays_score: 40,
        strings_score: 55,
        graphs_score: 30,
        dp_score: 20,
        trees_score: 60,
        backtracking_score: 10,
        contest_rating: 1200,
        acceptance_rate: 45.0,
        problems_solved: 120
      };

      const result = await aiService.getLearningPath(demoInput);
      setRoadmap(result.roadmap);
    } catch (error) {
      console.error("Error generating roadmap", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Route className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">AI Learning Path Generator</h1>
          <p className="text-muted-foreground">Get a personalized week-by-week roadmap based on your current skill level.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-md p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" /> Select Goal
            </h2>
            <div className="space-y-3">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                    goal === g 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            
            <button 
              onClick={generateRoadmap}
              disabled={loading}
              className="w-full mt-6 px-4 py-4 bg-foreground text-background font-bold rounded-md hover:bg-foreground/90 transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Generate Roadmap <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

        {/* Roadmap Display */}
        <div className="lg:col-span-3">
          {roadmap ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-card border border-border rounded-md p-6 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Your Personalized Plan</h3>
                  <p className="text-muted-foreground mt-1">Targeting: {goal}</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Active
                </div>
              </div>

              <div className="grid gap-6">
                {roadmap.map((week: any, index: number) => (
                  <div key={index} className="bg-card border border-border rounded-md p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>
                    
                    <div className="md:w-1/4 shrink-0">
                      <div className="text-sm font-bold text-primary tracking-widest uppercase mb-2">Phase {week.week}</div>
                      <h4 className="text-2xl font-extrabold text-foreground mb-4">Week {week.week}</h4>
                      <div className="flex flex-col gap-2">
                        {week.topics.map((topic: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm font-semibold bg-secondary px-3 py-2 rounded-lg text-foreground">
                            <BookOpen className="w-4 h-4 text-primary" /> {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:w-3/4 flex flex-col justify-center">
                      <h5 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Recommended Problems</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {week.problems.map((problem: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 border border-border/50 bg-background/50 hover:bg-secondary/50 transition-colors p-3 rounded-md cursor-pointer">
                            <div className="p-2 bg-primary/10 rounded-md text-primary">
                              <Code className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm">{problem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-md p-8 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                <Map className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No Roadmap Generated</h3>
              <p className="text-muted-foreground max-w-md">
                Select your goal from the sidebar and click "Generate Roadmap" to let our AI build a personalized curriculum tailored to your weaknesses and target company.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LearningPath;
