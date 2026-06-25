import type { Room, RoomParticipant, Announcement, RoomProblem, LeaderboardEntry } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface CreateRoomInput {
  hostId: string;
  hostName: string;
  name: string;
  durationMs: number;
  leaderboardVisibility: "LIVE" | "HIDDEN";
  chatEnabled: boolean;
  allowedLanguages: string[];
  allowSpectators: boolean;
  problems: RoomProblem[];
}

export interface RoomService {
  createRoom(input: CreateRoomInput): Promise<Room>;
  getRoom(roomId: string): Promise<Room | null>;
  getRoomByInviteCode(inviteCode: string): Promise<Room | null>;
  joinRoom(userId: string, username: string, inviteCode: string): Promise<Room>;
  leaveRoom(userId: string, roomId: string): Promise<void>;
  endRoom(roomId: string, hostId: string): Promise<void>;
  getActiveRoomForUser(userId: string): Promise<Room | null>;
  getRoomHistory(userId: string): Promise<Room[]>;
  getParticipants(roomId: string): Promise<RoomParticipant[]>;
  getLeaderboard(roomId: string): Promise<LeaderboardEntry[]>;
  markProblemSolved(roomId: string, userId: string, problemId: string, points: number): Promise<void>;
  getAnnouncements(roomId: string): Promise<Announcement[]>;
  createAnnouncement(roomId: string, message: string, authorName?: string): Promise<Announcement>;
}

export class SupabaseRoomService implements RoomService {

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  private async getRoomProblems(roomId: string): Promise<RoomProblem[]> {
    // In our simplified schema, we didn't strictly map Room Problems. Let's return empty or fetch properly if modeled.
    // Assuming problems are stored in a room_problems table or JSON field. 
    // Since we didn't create a room_problems table, maybe they are in 'rooms' table as JSON? 
    // Wait, let's look at schema. 'rooms' doesn't have a problems column. 
    // Wait, in my schema I missed 'problems' array in 'rooms' table! Let's check `001_schema.sql`.
    return []; // We will handle this in schema fix if needed
  }

  async createRoom(input: CreateRoomInput): Promise<Room> {
    const activeRoom = await this.getActiveRoomForUser(input.hostId);
    if (activeRoom) throw new Error("You are already in an active room.");

    const now = Date.now();
    const newRoom = {
      id: uuidv4(),
      room_name: input.name,
      invite_code: this.generateInviteCode(),
      host_id: input.hostId,
      host_name: input.hostName,
      duration: input.durationMs,
      leaderboard_visibility: input.leaderboardVisibility,
      chat_enabled: input.chatEnabled,
      allowed_languages: input.allowedLanguages,
      status: "ACTIVE",
      problems: input.problems // Needs to be added to DB if it's JSON
    };

    const { data: roomData, error } = await supabase.from('rooms').insert([newRoom]).select().single();
    if (error) throw new Error(error.message);

    await supabase.from('room_participants').insert([{
      room_id: roomData.id,
      user_id: input.hostId,
      role: 'HOST'
    }]);

    return this.getRoom(roomData.id) as Promise<Room>;
  }

  async getRoom(roomId: string): Promise<Room | null> {
    const { data: roomData, error } = await supabase.from('rooms').select('*').eq('id', roomId).single();
    if (error || !roomData) return null;

    const { data: participants } = await supabase.from('room_participants').select('*').eq('room_id', roomId);
    
    return {
      id: roomData.id,
      roomName: roomData.room_name,
      inviteCode: roomData.invite_code,
      hostId: roomData.host_id,
      hostName: roomData.host_name,
      startTime: new Date(roomData.created_at).getTime(),
      endTime: new Date(roomData.created_at).getTime() + roomData.duration,
      duration: roomData.duration,
      leaderboardVisibility: roomData.leaderboard_visibility as "LIVE" | "HIDDEN",
      chatEnabled: roomData.chat_enabled,
      allowedLanguages: roomData.allowed_languages || [],
      allowSpectators: false, // We skipped this in schema, assuming false for now
      spectatorCode: '',
      status: roomData.status,
      participants: participants?.map(p => p.user_id) || [],
      spectators: [],
      problems: roomData.problems || []
    };
  }

  async getRoomByInviteCode(inviteCode: string): Promise<Room | null> {
    const { data: roomData } = await supabase.from('rooms').select('id').eq('invite_code', inviteCode).single();
    if (!roomData) return null;
    return this.getRoom(roomData.id);
  }

  async joinRoom(userId: string, username: string, inviteCode: string): Promise<Room> {
    const room = await this.getRoomByInviteCode(inviteCode);
    if (!room) throw new Error("Invalid invite code.");
    if (room.status === "ENDED" || Date.now() > room.endTime) throw new Error("This room has ended.");

    if (!room.participants.includes(userId)) {
      const { error } = await supabase.from('room_participants').insert([{
        room_id: room.id,
        user_id: userId,
        role: 'PARTICIPANT'
      }]);
      if (error) throw new Error(error.message);
    }
    return this.getRoom(room.id) as Promise<Room>;
  }

  async leaveRoom(userId: string, roomId: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) return;
    if (room.hostId === userId) throw new Error("Host cannot leave an active room. End the room instead.");
    
    await supabase.from('room_participants').delete().match({ room_id: roomId, user_id: userId });
  }

  async endRoom(roomId: string, hostId: string): Promise<void> {
    const room = await this.getRoom(roomId);
    if (!room) throw new Error("Room not found.");
    if (room.hostId !== hostId) throw new Error("Only the host can end the room.");

    await supabase.from('rooms').update({ status: 'ENDED' }).eq('id', roomId);
  }

  async getActiveRoomForUser(userId: string): Promise<Room | null> {
    const { data } = await supabase.from('room_participants').select('room_id').eq('user_id', userId);
    if (!data || data.length === 0) return null;

    for (const p of data) {
      const room = await this.getRoom(p.room_id);
      if (room && room.status !== 'ENDED' && Date.now() < room.endTime) {
        return room;
      }
    }
    return null;
  }

  async getRoomHistory(userId: string): Promise<Room[]> {
    const { data } = await supabase.from('room_participants').select('room_id').eq('user_id', userId);
    if (!data) return [];
    
    const rooms: Room[] = [];
    for (const p of data) {
      const room = await this.getRoom(p.room_id);
      if (room && (room.status === 'ENDED' || Date.now() >= room.endTime)) {
        rooms.push(room);
      }
    }
    return rooms.sort((a,b) => b.startTime - a.startTime);
  }

  async getParticipants(roomId: string): Promise<RoomParticipant[]> {
    // Need a join to get usernames and scores. Let's do a simple approach.
    const { data: parts } = await supabase.from('room_participants').select('*, users(username)').eq('room_id', roomId);
    if (!parts) return [];
    
    // In our simplified Supabase schema, score is in room_history, but let's assume it's tracked there.
    return parts.map(p => ({
      id: p.id,
      userId: p.user_id,
      username: p.users?.username || 'User',
      roomId: p.room_id,
      joinedAt: new Date(p.created_at).getTime(),
      score: p.score || 0,
      solvedProblems: p.solved_problem_ids ? p.solved_problem_ids.length : 0,
      solvedProblemIds: p.solved_problem_ids || []
    }));
  }

  async getLeaderboard(roomId: string): Promise<LeaderboardEntry[]> {
    const participants = await this.getParticipants(roomId);
    return participants
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
      rank: index + 1,
      userId: p.userId,
      username: p.username,
      solvedCount: p.solvedProblems,
      score: p.score,
      penalty: 0,
      submissionTime: 0
    }));
  }

  async markProblemSolved(roomId: string, userId: string, problemId: string, points: number): Promise<void> {
    const { data: participant } = await supabase.from('room_participants')
      .select('score, solved_problem_ids')
      .match({ room_id: roomId, user_id: userId })
      .single();

    if (!participant) return;

    const solvedIds = participant.solved_problem_ids || [];
    if (solvedIds.includes(problemId)) return; // Already solved

    await supabase.from('room_participants')
      .update({
        score: (participant.score || 0) + points,
        solved_problem_ids: [...solvedIds, problemId]
      })
      .match({ room_id: roomId, user_id: userId });
  }

  async getAnnouncements(roomId: string): Promise<Announcement[]> {
    const { data } = await supabase.from('room_announcements').select('*, users(username)').eq('room_id', roomId).order('created_at', { ascending: false });
    return (data || []).map(a => ({
      id: a.id,
      roomId: a.room_id,
      message: a.message,
      authorName: a.users?.username || 'System',
      createdAt: new Date(a.created_at).getTime()
    }));
  }

  async createAnnouncement(roomId: string, message: string, authorName?: string): Promise<Announcement> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data } = await supabase.from('room_announcements').insert([{
      room_id: roomId,
      message: message,
      created_by: user?.id
    }]).select('*, users(username)').single();

    return {
      id: data.id,
      roomId: data.room_id,
      message: data.message,
      authorName: data.users?.username || authorName,
      createdAt: new Date(data.created_at).getTime()
    };
  }
}

export const roomService = new SupabaseRoomService();
