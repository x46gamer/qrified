export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    name: string;
    avatar_url: string | null;
    role: 'user' | 'admin' | 'employee';
    created_at: string;
    updated_at: string;
    trial_status: 'not_started' | 'active' | 'expired';
    trial_started_at: string | null;
    trial_ended_at: string | null;
    subscription_type: 'none' | 'monthly' | 'annual' | 'lifetime';
    subscription_status: 'inactive' | 'active' | 'canceled';
    subscription_started_at: string | null;
    subscription_ends_at: string | null;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
}

export interface UserLimits {
    user_id: string;
    monthly_qr_limit: number;
    is_unlimited: boolean;
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