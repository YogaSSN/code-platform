import { User, UserRole } from '../types';
import { roleService } from './roleService';

export interface UserManagementService {
  getAllUsers(superAdmin: User): Promise<User[]>;
  changeUserRole(superAdmin: User, targetUserId: string, newRole: UserRole): Promise<User>;
}

export class SupabaseUserManagementService implements UserManagementService {
  
  private checkAccess(user: User) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new Error("Unauthorized: Only Super Admins can manage users.");
    }
  }

  async getAllUsers(superAdmin: User): Promise<User[]> {
    this.checkAccess(superAdmin);
    return roleService.getAllUsers();
  }

  async changeUserRole(superAdmin: User, targetUserId: string, newRole: UserRole): Promise<User> {
    this.checkAccess(superAdmin);
    return roleService.updateUserRole(superAdmin.id, targetUserId, newRole);
  }
}

export const userManagementService = new SupabaseUserManagementService();
