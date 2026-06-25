import React, { useEffect, useState } from 'react';
import { User, UserRole } from '../../types';
import { userManagementService } from '../../services/userManagement';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import RoleBadge from '../../components/RoleBadge';

const UserManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    if (user) {
      userManagementService.getAllUsers(user)
        .then(u => {
          setUsers(u);
          setLoading(false);
        })
        .catch(err => {
          alert("Error fetching users: " + err.message);
          setLoading(false);
        });
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    if (!user) return;
    try {
      await userManagementService.changeUserRole(user, targetUserId, newRole);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update role");
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-card rounded-md"></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">Super Admins can view and manage user roles here.</p>
      </div>

      <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="py-4 px-6 font-semibold text-muted-foreground w-16">ID</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground">Username</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground">Email</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground w-40">Role Badge</th>
                <th className="py-4 px-6 font-semibold text-muted-foreground text-right w-48">Modify Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === user?.id;
                
                let currentRole: UserRole = u.role;
                if (currentRole === 'user' as any) currentRole = 'STUDENT';
                if (currentRole === 'admin' as any) currentRole = 'ADMIN';

                return (
                  <tr key={u.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="py-4 px-6 text-muted-foreground text-xs">{u.id.slice(0, 8)}...</td>
                    <td className="py-4 px-6 font-medium text-foreground flex items-center gap-2">
                      {u.username} {isSelf && <span className="text-[10px] uppercase bg-primary/20 text-primary px-1.5 rounded-sm">You</span>}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">{u.email}</td>
                    <td className="py-4 px-6">
                      <RoleBadge role={currentRole} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select 
                        value={currentRole} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        disabled={isSelf}
                        className="bg-secondary border border-border text-foreground text-sm rounded-md focus:ring-primary focus:border-primary block w-full p-2 disabled:opacity-50"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
