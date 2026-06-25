import { Problem, Example, TestCase } from '../types';
import { supabase } from '../lib/supabase';

export interface ProblemService {
  getProblems(): Promise<Problem[]>;
  getProblemBySlug(slug: string): Promise<Problem | null>;
  addProblem(problem: Problem): Promise<Problem>;
  updateProblem(id: string, problem: Partial<Problem>): Promise<Problem | null>;
  deleteProblem(id: string): Promise<boolean>;
}

export class SupabaseProblemService implements ProblemService {
  
  private mapToProblem(data: any): Problem {
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      difficulty: data.difficulty,
      description: data.description,
      tags: data.tags || [],
      starterCode: data.starter_code || {},
      acceptanceRate: Number(data.acceptance_rate) || 0,
      examples: (data.problem_examples || []).map((ex: any) => ({
        id: ex.id,
        input: ex.input,
        output: ex.output,
        explanation: ex.explanation || undefined
      })),
      constraints: (data.problem_constraints || []).map((c: any) => c.constraint_text),
      testCases: (data.test_cases || []).map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expected_output,
        isHidden: tc.hidden
      }))
    };
  }

  async getProblems(): Promise<Problem[]> {
    const { data, error } = await supabase
      .from('problems')
      .select(`
        *,
        problem_examples (*),
        problem_constraints (*),
        test_cases (*)
      `);

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToProblem);
  }

  async getProblemBySlug(slug: string): Promise<Problem | null> {
    const { data, error } = await supabase
      .from('problems')
      .select(`
        *,
        problem_examples (*),
        problem_constraints (*),
        test_cases (*)
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return this.mapToProblem(data);
  }

  async addProblem(problem: Problem): Promise<Problem> {
    // Insert into problems table
    const { data: pData, error: pError } = await supabase
      .from('problems')
      .insert([{
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description,
        tags: problem.tags,
        starter_code: problem.starterCode,
        acceptance_rate: problem.acceptanceRate || 0
      }])
      .select()
      .single();

    if (pError) throw new Error(pError.message);

    // Insert examples
    if (problem.examples?.length > 0) {
      await supabase.from('problem_examples').insert(
        problem.examples.map(ex => ({
          problem_id: pData.id,
          input: ex.input,
          output: ex.output,
          explanation: ex.explanation
        }))
      );
    }

    // Insert constraints
    if (problem.constraints?.length > 0) {
      await supabase.from('problem_constraints').insert(
        problem.constraints.map(c => ({
          problem_id: pData.id,
          constraint_text: c
        }))
      );
    }

    // Insert test cases
    if (problem.testCases?.length > 0) {
      await supabase.from('test_cases').insert(
        problem.testCases.map(tc => ({
          problem_id: pData.id,
          input: tc.input,
          expected_output: tc.expectedOutput,
          hidden: tc.isHidden
        }))
      );
    }

    return this.getProblemBySlug(pData.slug) as Promise<Problem>;
  }

  async updateProblem(id: string, updates: Partial<Problem>): Promise<Problem | null> {
    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.slug) updateData.slug = updates.slug;
    if (updates.difficulty) updateData.difficulty = updates.difficulty;
    if (updates.description) updateData.description = updates.description;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.starterCode) updateData.starter_code = updates.starterCode;
    if (updates.acceptanceRate !== undefined) updateData.acceptance_rate = updates.acceptanceRate;

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase.from('problems').update(updateData).eq('id', id);
      if (error) throw new Error(error.message);
    }

    // To properly update nested arrays, a simpler approach is delete all and re-insert
    if (updates.examples) {
      await supabase.from('problem_examples').delete().eq('problem_id', id);
      await supabase.from('problem_examples').insert(
        updates.examples.map(ex => ({
          problem_id: id,
          input: ex.input,
          output: ex.output,
          explanation: ex.explanation
        }))
      );
    }

    if (updates.constraints) {
      await supabase.from('problem_constraints').delete().eq('problem_id', id);
      await supabase.from('problem_constraints').insert(
        updates.constraints.map(c => ({
          problem_id: id,
          constraint_text: c
        }))
      );
    }

    if (updates.testCases) {
      await supabase.from('test_cases').delete().eq('problem_id', id);
      await supabase.from('test_cases').insert(
        updates.testCases.map(tc => ({
          problem_id: id,
          input: tc.input,
          expected_output: tc.expectedOutput,
          hidden: tc.isHidden
        }))
      );
    }

    const { data: updatedSlug } = await supabase.from('problems').select('slug').eq('id', id).single();
    if (!updatedSlug) return null;
    return this.getProblemBySlug(updatedSlug.slug);
  }

  async deleteProblem(id: string): Promise<boolean> {
    const { error } = await supabase.from('problems').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
}

export const problemService = new SupabaseProblemService();
