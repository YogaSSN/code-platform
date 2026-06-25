import type { Achievement } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface AchievementService {
  getAchievements(userId: string): Promise<Achievement[]>;
  unlockAchievement(userId: string, badgeId: string, title: string, description: string): Promise<Achievement | null>;
}

export class SupabaseAchievementService implements AchievementService {
  async getAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    
    return (data || []).map(a => ({
      id: a.id,
      userId: a.user_id,
      badgeId: a.badge_name, // Mapping badge_name to badgeId for frontend compat
      title: a.badge_name,
      description: a.description || '',
      unlockedAt: new Date(a.created_at).getTime()
    }));
  }

  async unlockAchievement(userId: string, badgeId: string, title: string, description: string): Promise<Achievement | null> {
    const { data: existing } = await supabase
      .from('achievements')
      .select('id')
      .match({ user_id: userId, badge_name: badgeId })
      .maybeSingle();

    if (existing) return null;

    const { data, error } = await supabase
      .from('achievements')
      .insert([{
        id: uuidv4(),
        user_id: userId,
        badge_name: badgeId,
        description
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      badgeId: data.badge_name,
      title: title, // Frontend title
      description: data.description || '',
      unlockedAt: new Date(data.created_at).getTime()
    };
  }
}

export const achievementService = new SupabaseAchievementService();
