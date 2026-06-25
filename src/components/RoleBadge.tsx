import React from 'react';
import { UserRole } from '../types';
import { Shield, ShieldAlert, User } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole | string; // Accept string for legacy 'user' or 'admin'
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  let normalizedRole = role;
  if (role === 'user') normalizedRole = 'STUDENT';
  if (role === 'admin') normalizedRole = 'ADMIN';

  switch (normalizedRole) {
    case 'SUPER_ADMIN':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-500 border border-purple-500/30 ${className}`}>
          <ShieldAlert className="w-3.5 h-3.5" />
          Super Admin
        </span>
      );
    case 'ADMIN':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-500 border border-blue-500/30 ${className}`}>
          <Shield className="w-3.5 h-3.5" />
          Admin
        </span>
      );
    case 'STUDENT':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/15 text-gray-500 border border-gray-500/30 ${className}`}>
          <User className="w-3.5 h-3.5" />
          Student
        </span>
      );
  }
};

export default RoleBadge;
