
export type UserRole = 'admin' | 'employee' | null;

export interface User {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
