import { Discussion } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface DiscussionInput {
  problemId: string;
  userId: string;
  content: string;
}

export interface DiscussionService {
  getProblemDiscussions(problemId: string): Promise<Discussion[]>;
  createDiscussion(input: DiscussionInput): Promise<Discussion>;
  upvote(discussionId: string): Promise<void>;
  downvote(discussionId: string): Promise<void>;
  reply(discussionId: string, userId: string, content: string): Promise<void>;
}

export class SupabaseDiscussionService implements DiscussionService {
  
  async getProblemDiscussions(problemId: string): Promise<Discussion[]> {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        *,
        discussion_replies (*)
      `)
      .eq('problem_id', problemId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    
    return (data || []).map((d: any) => ({
      id: d.id,
      problemId: d.problem_id,
      userId: d.user_id,
      content: d.content,
      upvotes: d.upvotes || 0,
      downvotes: d.downvotes || 0,
      createdAt: d.created_at,
      replies: (d.discussion_replies || []).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        content: r.content,
        createdAt: r.created_at
      })).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }));
  }

  async createDiscussion(input: DiscussionInput): Promise<Discussion> {
    const { data, error } = await supabase
      .from('discussions')
      .insert([{
        id: uuidv4(),
        problem_id: input.problemId,
        user_id: input.userId,
        content: input.content
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    
    return {
      id: data.id,
      problemId: data.problem_id,
      userId: data.user_id,
      content: data.content,
      upvotes: data.upvotes || 0,
      downvotes: data.downvotes || 0,
      createdAt: data.created_at,
      replies: []
    };
  }

  async upvote(discussionId: string): Promise<void> {
    const { data: d } = await supabase.from('discussions').select('upvotes').eq('id', discussionId).single();
    if (d) {
      await supabase.from('discussions').update({ upvotes: (d.upvotes || 0) + 1 }).eq('id', discussionId);
    }
  }

  async downvote(discussionId: string): Promise<void> {
    const { data: d } = await supabase.from('discussions').select('downvotes').eq('id', discussionId).single();
    if (d) {
      await supabase.from('discussions').update({ downvotes: (d.downvotes || 0) + 1 }).eq('id', discussionId);
    }
  }

  async reply(discussionId: string, userId: string, content: string): Promise<void> {
    const { error } = await supabase
      .from('discussion_replies')
      .insert([{
        id: uuidv4(),
        discussion_id: discussionId,
        user_id: userId,
        content
      }]);
      
    if (error) throw new Error(error.message);
  }
}

export const discussionService = new SupabaseDiscussionService();
