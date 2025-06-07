export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
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