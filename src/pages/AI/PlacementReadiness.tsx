import React, { useEffect, useState } from 'react';
import { aiService, PlacementInput } from '../../services/aiService';
import { BrainCircuit, CheckCircle, XCircle, TrendingUp, AlertTriangle } from 'lucide-react';

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-secondary/50 stroke-current"
          strokeWidth="12"
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
        ></circle>
        <circle
          className={`stroke-current ${value >= 80 ? 'text-emerald-500' : value >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
          strokeWidth="12"
          strokeLinecap="round"
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        ></circle>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-foreground">{value}%</span>
        <span className="text-sm text-muted-foreground font-semibold">Ready</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value }: { label: string, value: number }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-foreground">{label}</span>
        <span className="text-sm font-semibold text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

const PlacementReadiness: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [importance, setImportance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demoInput: PlacementInput = {
          problems_solved: 350,
          easy_solved: 150,
          medium_solved: 150,
          hard_solved: 50,
          arrays_count: 80,
          strings_count: 50,
          graphs_count: 20,
          dp_count: 15,
          trees_count: 40,
          contest_rating: 1600,
          contest_count: 15,
          acceptance_rate: 65.5,
          current_streak: 12,
          room_wins: 5,
          room_participations: 10
        };

        const result = await aiService.getPlacementReadiness(demoInput);
        const imp = await aiService.getFeatureImportance();
        
        setData(result);
        setImportance(imp);
      } catch (error) {
        console.error("Error fetching AI data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load AI predictions. Ensure backend is running.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Placement Readiness Predictor</h1>
          <p className="text-muted-foreground text-sm">AI-powered analysis based on your problem-solving statistics and contest history.</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs font-semibold">
            <AlertTriangle className="w-3 h-3" /> AI recommendations are currently experimental.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Overall Score */}
        <div className="bg-card border border-border rounded-md p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold mb-6">Overall Score</h2>
          <CircularProgress value={data.overall_score} />
          <p className="mt-6 text-muted-foreground text-sm leading-relaxed max-w-[250px]">
            This score reflects your probability of clearing technical interviews at major tech companies based on our ML model.
          </p>
        </div>

        {/* Company Readiness */}
        <div className="bg-card border border-border rounded-md p-8 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Company Readiness
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-4">
            <ProgressBar label="Amazon" value={data.amazon_score} />
            <ProgressBar label="Google" value={data.google_score} />
            <ProgressBar label="Microsoft" value={data.microsoft_score} />
            <ProgressBar label="Zoho" value={data.zoho_score} />
            <ProgressBar label="TCS" value={data.tcs_score} />
            <ProgressBar label="Infosys" value={data.infosys_score} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Strong Areas */}
        <div className="bg-card border border-emerald-500/30 rounded-md p-6 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Strong Areas
          </h3>
          <ul className="space-y-3">
            {data.strong_topics.length > 0 ? data.strong_topics.map((topic: string, i: number) => (
              <li key={i} className="flex items-center gap-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium">
                ✓ {topic}
              </li>
            )) : <p className="text-muted-foreground">Keep practicing to build your strengths!</p>}
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="bg-card border border-red-500/30 rounded-md p-6 shadow-sm">
          <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> Needs Improvement
          </h3>
          <ul className="space-y-3">
            {data.weak_topics.length > 0 ? data.weak_topics.map((topic: string, i: number) => (
              <li key={i} className="flex items-center gap-3 bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-medium">
                ✗ {topic}
              </li>
            )) : <p className="text-muted-foreground">You don't have any major weak spots. Great job!</p>}
          </ul>
        </div>

        {/* Feature Importance */}
        <div className="bg-card border border-border rounded-md p-6 shadow-sm">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Feature Importance
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Top factors influencing your score (based on ML model)</p>
          <div className="space-y-3">
            {importance && Object.entries(importance).map(([feature, weight]: any, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="capitalize">{feature.replace('_', ' ')}</span>
                  <span>{weight.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary/80 h-1.5 rounded-full" style={{ width: `${weight}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlacementReadiness;
