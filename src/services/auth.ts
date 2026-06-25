import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

export interface RegisterInput {
  username: string;
  email: string;
  password?: string;
}

export interface AuthService {
  login(email: string, password?: string): Promise<User>;
  register(data: RegisterInput): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getUser(userId: string): Promise<User | null>;
  updateProfile(userId: string, data: Partial<User>): Promise<User>;
  updateUserStats(userId: string, problemId: string): Promise<void>;
}

export class SupabaseAuthService implements AuthService {
  private async mapSupabaseUserToUser(supabaseUser: any, userProfile: any): Promise<User> {
    return {
      id: supabaseUser.id,
      username: userProfile.username,
      email: userProfile.email,
      role: userProfile.role as UserRole,
      createdAt: userProfile.created_at,
      solvedProblems: userProfile.solved_problems || [],
      contestRating: userProfile.contest_rating || 1500,
      avatar: userProfile.avatar_url,
      bio: userProfile.bio,
      location: userProfile.location,
      company: userProfile.company,
      website: userProfile.website,
      github: userProfile.github_url,
      twitter: userProfile.twitter_url,
    };
  }

  async login(email: string, password?: string): Promise<User> {
    if (!password) throw new Error('Password is required for Supabase login');
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Invalid credentials');
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();
      
    if (profileError || !profileData) {
      throw new Error('User profile not found in database');
    }
    
    return this.mapSupabaseUserToUser(authData.user, profileData);
  }

  async register(data: RegisterInput): Promise<User> {
    if (!data.password) throw new Error('Password is required for Supabase registration');
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    
    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Registration failed');
    }
    
    // Create profile in users table
    const newProfile = {
      id: authData.user.id,
      email: data.email,
      username: data.username,
      role: 'STUDENT',
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}&background=3b82f6&color=fff&bold=true`
    };
    
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([newProfile])
      .select()
      .single();
      
    if (profileError || !profileData) {
      throw new Error('Failed to create user profile: ' + profileError?.message);
    }
    
    return this.mapSupabaseUserToUser(authData.user, profileData);
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session?.user) return null;
    
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.session.user.id)
      .single();
      
    if (!profileData) return null;
    return this.mapSupabaseUserToUser(authData.session.user, profileData);
  }

  async getUser(id: string): Promise<User | null> {
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (!profileData) return null;
    return this.mapSupabaseUserToUser({ id: profileData.id }, profileData);
  }
  
  async updateUserStats(userId: string, problemId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    
    if (!user.solvedProblems.includes(problemId)) {
      const newSolvedProblems = [...user.solvedProblems, problemId];
      await supabase
        .from('users')
        .update({ solved_problems: newSolvedProblems })
        .eq('id', userId);
    }
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const updateData: any = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.avatar !== undefined) updateData.avatar_url = data.avatar;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.website !== undefined) updateData.website = data.website;
    if (data.github !== undefined) updateData.github_url = data.github;
    if (data.twitter !== undefined) updateData.twitter_url = data.twitter;
    
    const { data: profileData, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
      
    if (error || !profileData) throw new Error(error?.message || 'Failed to update profile');
    
    return this.mapSupabaseUserToUser({ id: userId }, profileData);
  }
}

export const authService = new SupabaseAuthService();
