const BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000';

export interface PlacementInput {
  problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  arrays_count: number;
  strings_count: number;
  graphs_count: number;
  dp_count: number;
  trees_count: number;
  contest_rating: number;
  contest_count: number;
  acceptance_rate: number;
  current_streak: number;
  room_wins: number;
  room_participations: number;
}

export interface LearningPathInput {
  goal: string;
  arrays_score: number;
  strings_score: number;
  graphs_score: number;
  dp_score: number;
  trees_score: number;
  backtracking_score: number;
  contest_rating: number;
  acceptance_rate: number;
  problems_solved: number;
}

export const aiService = {
  async getPlacementReadiness(data: PlacementInput) {
    const response = await fetch(`${BASE_URL}/ai/placement-readiness`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch placement readiness');
    }
    return response.json();
  },

  async getFeatureImportance() {
    const response = await fetch(`${BASE_URL}/ai/feature-importance`);
    if (!response.ok) {
      throw new Error('Failed to fetch feature importance');
    }
    return response.json();
  },

  async getLearningPath(data: LearningPathInput) {
    const response = await fetch(`${BASE_URL}/ai/learning-path`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch learning path');
    }
    return response.json();
  }
};
