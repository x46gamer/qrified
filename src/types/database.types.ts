export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      custom_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          ssl_status: string
          status: string
          user_id: string
          verification_token: string
          verified_at: string
          dns_type: 'cname' | 'a' | 'nameservers' | 'txt'
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          ssl_status?: string
          status?: string
          user_id: string
          verification_token?: string
          verified_at?: string
          dns_type?: 'cname' | 'a' | 'nameservers' | 'txt'
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          ssl_status?: string
          status?: string
          user_id?: string
          verification_token?: string
          verified_at?: string
          dns_type?: 'cname' | 'a' | 'nameservers' | 'txt'
        }
        Relationships: [
          {
            foreignKeyName: "custom_domains_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // ... other tables ...
    }
    // ... other schema definitions ...
  }
} 