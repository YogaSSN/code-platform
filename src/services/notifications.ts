import type { Notification } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface NotificationService {
  getNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  createNotification(userId: string, type: Notification['type'], title: string, message: string): Promise<void>;
}

export class SupabaseNotificationService implements NotificationService {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    
    return (data || []).map((n: any) => ({
      id: n.id,
      userId: n.user_id,
      type: 'INFO', // the schema didn't store type explicitly but ui relies on it, fallback
      title: n.title,
      message: n.message,
      read: n.is_read,
      createdAt: new Date(n.created_at).getTime()
    }));
  }

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) throw new Error(error.message);
  }

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
      
    if (error) throw new Error(error.message);
  }

  async createNotification(userId: string, type: Notification['type'], title: string, message: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert([{
        id: uuidv4(),
        user_id: userId,
        title,
        message,
        is_read: false
      }]);
      
    if (error) throw new Error(error.message);
  }
}

export const notificationService = new SupabaseNotificationService();
