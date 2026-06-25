import { Problem, User } from '../types';
import { problemService } from './problems';
import { v4 as uuidv4 } from 'uuid';

export interface ProblemManagementService {
  addProblem(adminUser: User, problem: Omit<Problem, 'id'>): Promise<Problem>;
  updateProblem(adminUser: User, id: string, updates: Partial<Problem>): Promise<Problem | null>;
  deleteProblem(adminUser: User, id: string): Promise<boolean>;
}

export class SupabaseProblemManagementService implements ProblemManagementService {
  
  private checkAccess(user: User) {
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw new Error("Unauthorized: Only Admins can manage problems.");
    }
  }

  async addProblem(adminUser: User, problem: Omit<Problem, 'id'>): Promise<Problem> {
    this.checkAccess(adminUser);
    const newProblem: Problem = {
      ...problem,
      id: uuidv4()
    };
    return problemService.addProblem(newProblem);
  }

  async updateProblem(adminUser: User, id: string, updates: Partial<Problem>): Promise<Problem | null> {
    this.checkAccess(adminUser);
    return problemService.updateProblem(id, updates);
  }

  async deleteProblem(adminUser: User, id: string): Promise<boolean> {
    this.checkAccess(adminUser);
    return problemService.deleteProblem(id);
  }
}

export const problemManagementService = new SupabaseProblemManagementService();
