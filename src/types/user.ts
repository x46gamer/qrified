export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
    trial_started_at: string | null;
    trial_ended_at: string | null;
    trial_status: 'not_started' | 'active' | 'expired';
}

export interface UpdateProfileData {
    email?: string;
    full_name?: string;
    avatar_url?: string;
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface ResetAccountData {
    password: string;
    confirm_password: string;
} 