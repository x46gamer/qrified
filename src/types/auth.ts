export type UserRole = 'admin' | 'employee' | 'user' | null;

export interface User {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
  avatar_url?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
