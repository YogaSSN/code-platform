import React, { useEffect, useState } from 'react';
import { Problem } from '../../types';
import { problemService } from '../../services/problems';
import { problemManagementService } from '../../services/problemManagement';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ProblemManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState(''); // Comma separated for simplicity in UI
  const [tags, setTags] = useState(''); // Comma separated
  const [examplesJson, setExamplesJson] = useState('[]');
  const [testCasesJson, setTestCasesJson] = useState('[]');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = () => {
    problemService.getProblems().then(p => {
      setProblems(p);
      setLoading(false);
    });
  };

  const openAddModal = () => {
    setEditingProblem(null);
    setTitle('');
    setDifficulty('Easy');
    setDescription('');
    setConstraints('');
    setTags('');
    setExamplesJson('[]');
    setTestCasesJson('[]');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Problem) => {
    setEditingProblem(p);
    setTitle(p.title);
    setDifficulty(p.difficulty);
    setDescription(p.description);
    setConstraints(p.constraints.join(', '));
    setTags(p.tags.join(', '));
    setExamplesJson(JSON.stringify(p.examples, null, 2));
    setTestCasesJson(JSON.stringify(p.testCases, null, 2));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this problem?")) {
      if (user) {
        await problemManagementService.deleteProblem(user, id);
        fetchProblems();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const parsedExamples = JSON.parse(examplesJson);
      const parsedTestCases = JSON.parse(testCasesJson);
      
      const payload = {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        difficulty,
        description,
        constraints: constraints.split(',').map(s => s.trim()).filter(Boolean),
        tags: tags.split(',').map(s => s.trim()).filter(Boolean),
        examples: parsedExamples,
        testCases: parsedTestCases,
        starterCode: editingProblem ? editingProblem.starterCode : {
          JavaScript: 'function solve() {\n  // Write your code here\n}',
          Python: 'def solve():\n    # Write your code here\n    pass'
        }
      };

      if (editingProblem) {
        await problemManagementService.updateProblem(user, editingProblem.id, payload);
      } else {
        await problemManagementService.addProblem(user, payload);
      }
      setIsModalOpen(false);
      fetchProblems();
    } catch (err: any) {
      alert("Error saving problem: " + err.message);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-card rounded-md"></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Problem Management</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove problems and test cases.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" /> Add Problem
        </button>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="py-4 px-6 font-semibold text-muted-foreground w-16">ID</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground">Title</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground w-32">Difficulty</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr key={problem.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="py-4 px-6 text-muted-foreground text-xs">{index + 1}</td>
                  <td className="py-4 px-6 font-medium text-foreground">{problem.title}</td>
                  <td className="py-4 px-6">
                    <span className={`text-sm font-medium ${
                      problem.difficulty === 'Easy' ? 'text-easy' : 
                      problem.difficulty === 'Medium' ? 'text-medium' : 'text-hard'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(problem)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(problem.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">{editingProblem ? 'Edit Problem' : 'Add Problem'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full px-3 py-2 bg-background border border-border rounded-md">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description (HTML)</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full h-32 px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Constraints (comma separated)</label>
                <input type="text" value={constraints} onChange={e => setConstraints(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tags (comma separated)</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Examples (JSON array)</label>
                <textarea required value={examplesJson} onChange={e => setExamplesJson(e.target.value)} className="w-full h-32 px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Test Cases (JSON array)</label>
                <textarea required value={testCasesJson} onChange={e => setTestCasesJson(e.target.value)} className="w-full h-32 px-3 py-2 bg-background border border-border rounded-md font-mono text-sm" />
              </div>
            </form>

            <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
              <button onClick={() => setIsModalOpen(false)} type="button" className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md">
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md">
                Save Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemManagement;
