export type UserRole = "STUDENT" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  solvedProblems: string[];
  contestRating: number;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
  github?: string;
  twitter?: string;
  challengeWins?: number;
  challengeLosses?: number;
  currentWinStreak?: number;
  bestWinStreak?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Example {
  id: string;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string[];
  examples: Example[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  tags: string[];
  acceptanceRate?: number;
  status?: "Solved" | "Attempted" | "Todo";
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | "Compilation Error";
  runtime: number; // ms
  memory: number; // MB
  passedCases: number;
  totalCases: number;
  submittedAt: string;
  roomId?: string;
}

export interface ExecutionResult {
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | "Compilation Error";
  runtime: number;
  memory: number;
  output: string;
  expectedOutput: string;
  passedCases: number;
  totalCases: number;
  errorMessage?: string;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Discussion {
  id: string;
  problemId: string;
  userId: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  replies: DiscussionReply[];
}

export interface Contest {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems: string[]; // problem ids
  participants: string[];
}

export interface RoomProblem extends Problem {
  roomId: string;
}

export interface Room {
  id: string;
  roomName: string;
  inviteCode: string;
  hostId: string;
  hostName: string;
  startTime: number;
  endTime: number;
  duration: number; // in milliseconds
  leaderboardVisibility: "LIVE" | "HIDDEN";
  chatEnabled: boolean;
  allowedLanguages: string[];
  allowSpectators: boolean;
  spectatorCode: string;
  status: "ACTIVE" | "ENDED";
  participants: string[];
  spectators: string[];
  problems: RoomProblem[];
}

export interface RoomParticipant {
  id: string;
  userId: string;
  username: string;
  roomId: string;
  joinedAt: number;
  score: number;
  solvedProblems: number;
  solvedProblemIds: string[];
}

export interface Announcement {
  id: string;
  roomId: string;
  message: string;
  authorName?: string;
  createdAt: number;
}

export interface Challenge {
  id: string;
  challengeName: string;
  inviteCode: string;
  challengeMessage?: string;
  allowedLanguages: string[]; // e.g. ["Python", "Java"] or ["*"] for any
  player1Id: string;
  player2Id?: string;
  problemId: string;
  duration: number; // in milliseconds
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  status: "WAITING" | "ACTIVE" | "COMPLETED" | "FORFEITED";
  winnerId?: string;
  player1Ready: boolean;
  player2Ready: boolean;
  player1Status: "Waiting" | "Working" | "Solved";
  player2Status: "Waiting" | "Working" | "Solved";
  
  // Connection Status Tracking
  player1Connection: "Online" | "Reconnecting" | "Offline";
  player2Connection: "Online" | "Reconnecting" | "Offline";
  player1DisconnectTime?: number;
  player2DisconnectTime?: number;
  
  player1SubmissionTime?: number;
  player2SubmissionTime?: number;
  player1ExecutionTime?: number;
  player2ExecutionTime?: number;
  createdAt: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  solvedCount: number;
  score: number;
  penalty: number;
  submissionTime: number;
}

export interface Note {
  id: string;
  userId: string;
  problemId: string;
  content: string;
  updatedAt: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  problemId: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "ROOM_INVITE" | "ROOM_ENDED" | "ANNOUNCEMENT" | "DAILY_CHALLENGE" | "ACHIEVEMENT";
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  title: string;
  description: string;
  unlockedAt: number;
}

export interface RunCodeInput {
  code: string;
  language: string;
  testCases: TestCase[];
}

export interface SubmitCodeInput {
  userId: string;
  problemId: string;
  code: string;
  language: string;
  roomId?: string;
}
