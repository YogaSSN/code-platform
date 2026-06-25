import type { Bookmark } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface BookmarkService {
  getBookmarks(userId: string): Promise<Bookmark[]>;
  toggleBookmark(userId: string, problemId: string): Promise<void>;
  isBookmarked(userId: string, problemId: string): Promise<boolean>;
}

export class SupabaseBookmarkService implements BookmarkService {
  async getBookmarks(userId: string): Promise<Bookmark[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw new Error(error.message);
    
    return (data || []).map(b => ({
      id: b.id,
      userId: b.user_id,
      problemId: b.problem_id,
      createdAt: new Date(b.created_at).getTime()
    }));
  }

  async toggleBookmark(userId: string, problemId: string): Promise<void> {
    const isSaved = await this.isBookmarked(userId, problemId);
    if (isSaved) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .match({ user_id: userId, problem_id: problemId });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert([{
          id: uuidv4(),
          user_id: userId,
          problem_id: problemId
        }]);
      if (error) throw new Error(error.message);
    }
  }

  async isBookmarked(userId: string, problemId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .match({ user_id: userId, problem_id: problemId })
      .maybeSingle();
      
    if (error) throw new Error(error.message);
    return !!data;
  }
}

export const bookmarkService = new SupabaseBookmarkService();
