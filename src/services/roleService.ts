import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';
import { authService } from './auth';

export interface RoleService {
  getAllUsers(): Promise<User[]>;
  updateUserRole(adminId: string, targetUserId: string, newRole: UserRole): Promise<User>;
}

export class SupabaseRoleService implements RoleService {
  async getAllUsers(): Promise<User[]> {
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*');
      
    if (error) throw new Error(error.message);
    
    return usersData.map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role as UserRole,
      createdAt: u.created_at,
      solvedProblems: u.solved_problems || [],
      contestRating: u.contest_rating || 1500,
      avatar: u.avatar_url,
      bio: u.bio,
      location: u.location,
      company: u.company,
      website: u.website,
      github: u.github_url,
      twitter: u.twitter_url,
    }));
  }

  async updateUserRole(adminId: string, targetUserId: string, newRole: UserRole): Promise<User> {
    const admin = await authService.getUser(adminId);
    if (!admin) throw new Error("Admin user not found");
    
    if (admin.role !== 'SUPER_ADMIN') {
      throw new Error("Unauthorized: Only Super Admins can manage roles.");
    }
    
    if (admin.id === targetUserId) {
      throw new Error("You cannot modify your own role.");
    }
    
    const { data: targetData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', targetUserId)
      .single();
      
    if (fetchError || !targetData) throw new Error("Target user not found");
    
    const { data: updatedData, error: updateError } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', targetUserId)
      .select()
      .single();
      
    if (updateError || !updatedData) throw new Error("Failed to update user role");
    
    return {
      id: updatedData.id,
      username: updatedData.username,
      email: updatedData.email,
      role: updatedData.role as UserRole,
      createdAt: updatedData.created_at,
      solvedProblems: updatedData.solved_problems || [],
      contestRating: updatedData.contest_rating || 1500,
      avatar: updatedData.avatar_url,
      bio: updatedData.bio,
      location: updatedData.location,
      company: updatedData.company,
      website: updatedData.website,
      github: updatedData.github_url,
      twitter: updatedData.twitter_url,
    };
  }
}

export const roleService = new SupabaseRoleService();
