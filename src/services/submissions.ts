import { Submission } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface SubmissionInput {
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: Submission['status'];
  runtime: number;
  memory: number;
  passedCases: number;
  totalCases: number;
}

export interface SubmissionService {
  submit(data: SubmissionInput): Promise<Submission>;
  getSubmissions(userId: string): Promise<Submission[]>;
  getProblemSubmissions(userId: string, problemId: string): Promise<Submission[]>;
}

export class SupabaseSubmissionService implements SubmissionService {
  private mapToSubmission(data: any): Submission {
    return {
      id: data.id,
      userId: data.user_id,
      problemId: data.problem_id,
      code: data.code,
      language: data.language,
      status: data.status,
      runtime: data.runtime,
      memory: data.memory,
      passedCases: data.passed_cases,
      totalCases: data.total_cases,
      submittedAt: data.created_at,
    };
  }

  async submit(data: SubmissionInput): Promise<Submission> {
    const { data: insertedData, error } = await supabase
      .from('submissions')
      .insert([{
        id: uuidv4(),
        user_id: data.userId,
        problem_id: data.problemId,
        code: data.code,
        language: data.language,
        status: data.status,
        runtime: data.runtime,
        memory: data.memory,
        passed_cases: data.passedCases,
        total_cases: data.totalCases
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapToSubmission(insertedData);
  }

  async getSubmissions(userId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToSubmission);
  }

  async getProblemSubmissions(userId: string, problemId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .match({ user_id: userId, problem_id: problemId })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(this.mapToSubmission);
  }
}

export const submissionService = new SupabaseSubmissionService();
