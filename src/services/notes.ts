import type { Note } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface NotesService {
  getNote(userId: string, problemId: string): Promise<Note | null>;
  saveNote(userId: string, problemId: string, content: string): Promise<Note>;
}

export class SupabaseNotesService implements NotesService {
  async getNote(userId: string, problemId: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .match({ user_id: userId, problem_id: problemId })
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      problemId: data.problem_id,
      content: data.content,
      updatedAt: new Date(data.updated_at).getTime()
    };
  }

  async saveNote(userId: string, problemId: string, content: string): Promise<Note> {
    const existing = await this.getNote(userId, problemId);
    
    if (existing) {
      const { data, error } = await supabase
        .from('notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      return {
        id: data.id,
        userId: data.user_id,
        problemId: data.problem_id,
        content: data.content,
        updatedAt: new Date(data.updated_at).getTime()
      };
    } else {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          id: uuidv4(),
          user_id: userId,
          problem_id: problemId,
          content
        }])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      return {
        id: data.id,
        userId: data.user_id,
        problemId: data.problem_id,
        content: data.content,
        updatedAt: new Date(data.updated_at).getTime()
      };
    }
  }
}

export const notesService = new SupabaseNotesService();
