export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accountability_access_events: {
        Row: {
          accessed_at: string
          id: number
          partner_id: string
          relationship_id: string
          resource: string
        }
        Insert: {
          accessed_at?: string
          id?: never
          partner_id: string
          relationship_id: string
          resource: string
        }
        Update: {
          accessed_at?: string
          id?: never
          partner_id?: string
          relationship_id?: string
          resource?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_access_events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountability_access_events_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "accountability_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      accountability_relationships: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invite_email: string | null
          invite_expires_at: string
          invite_token_hash: string
          owner_id: string
          partner_id: string | null
          permissions: Json
          revoked_at: string | null
          status: Database["public"]["Enums"]["relationship_status"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invite_email?: string | null
          invite_expires_at?: string
          invite_token_hash: string
          owner_id: string
          partner_id?: string | null
          permissions?: Json
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["relationship_status"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invite_email?: string | null
          invite_expires_at?: string
          invite_token_hash?: string
          owner_id?: string
          partner_id?: string | null
          permissions?: Json
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["relationship_status"]
        }
        Relationships: [
          {
            foreignKeyName: "accountability_relationships_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountability_relationships_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          description: string
          id: string
          rule: Json
          title: string
        }
        Insert: {
          description: string
          id: string
          rule?: Json
          title: string
        }
        Update: {
          description?: string
          id?: string
          rule?: Json
          title?: string
        }
        Relationships: []
      }
      alternative_activities: {
        Row: {
          active: boolean
          created_at: string
          duration_minutes: number | null
          id: string
          label: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          duration_minutes?: number | null
          id?: string
          label: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          duration_minutes?: number | null
          id?: string
          label?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alternative_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attention_zones: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attention_zones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_checkins: {
        Row: {
          created_at: string
          exposure: string
          id: string
          local_date: string
          mood: number
          occurred_at: string
          situations: string[]
          small_win: string | null
          updated_at: string
          urge_level: number
          user_id: string
        }
        Insert: {
          created_at?: string
          exposure: string
          id?: string
          local_date: string
          mood: number
          occurred_at?: string
          situations?: string[]
          small_win?: string | null
          updated_at?: string
          urge_level: number
          user_id: string
        }
        Update: {
          created_at?: string
          exposure?: string
          id?: string
          local_date?: string
          mood?: number
          occurred_at?: string
          situations?: string[]
          small_win?: string | null
          updated_at?: string
          urge_level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_focuses: {
        Row: {
          completed_at: string | null
          created_at: string
          focus: string
          local_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          focus: string
          local_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          focus?: string
          local_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_focuses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_missions: {
        Row: {
          checkin_completed: boolean
          completed_at: string | null
          created_at: string
          habit_completed: boolean
          local_date: string
          protection_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          checkin_completed?: boolean
          completed_at?: string | null
          created_at?: string
          habit_completed?: boolean
          local_date: string
          protection_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          checkin_completed?: boolean
          completed_at?: string | null
          created_at?: string
          habit_completed?: boolean
          local_date?: string
          protection_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed_at: string
          habit_id: string
          id: string
          local_date: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          habit_id: string
          id?: string
          local_date: string
          user_id: string
        }
        Update: {
          completed_at?: string
          habit_id?: string
          id?: string
          local_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          active: boolean
          cadence: string
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          cadence?: string
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          cadence?: string
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          body: string
          created_at: string
          id: string
          mood: number | null
          occurred_at: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          mood?: number | null
          occurred_at?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          mood?: number | null
          occurred_at?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_reasons: {
        Row: {
          active: boolean
          created_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_reasons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      power_up_logs: {
        Row: {
          activity_id: string
          completed_at: string
          id: string
          local_date: string
          user_id: string
        }
        Insert: {
          activity_id: string
          completed_at?: string
          id?: string
          local_date: string
          user_id: string
        }
        Update: {
          activity_id?: string
          completed_at?: string
          id?: string
          local_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "power_up_logs_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "alternative_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "power_up_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      presence_xp_events: {
        Row: {
          earned_at: string
          id: string
          points: number
          source: string
          source_key: string
          user_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          points: number
          source: string
          source_key: string
          user_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          points?: number
          source?: string
          source_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presence_xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_preferences: {
        Row: {
          browser_notifications: boolean
          personal_analytics: boolean
          quick_exit: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          browser_notifications?: boolean
          personal_analytics?: boolean
          quick_exit?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          browser_notifications?: boolean
          personal_analytics?: boolean
          quick_exit?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "privacy_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          discreet_mode: boolean
          display_name: string | null
          hide_sensitive_numbers: boolean
          id: string
          locale: string
          onboarding_completed: boolean
          role: string
          spiritual_mode: Database["public"]["Enums"]["spiritual_mode"]
          theme: string
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discreet_mode?: boolean
          display_name?: string | null
          hide_sensitive_numbers?: boolean
          id: string
          locale?: string
          onboarding_completed?: boolean
          role?: string
          spiritual_mode?: Database["public"]["Enums"]["spiritual_mode"]
          theme?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discreet_mode?: boolean
          display_name?: string | null
          hide_sensitive_numbers?: boolean
          id?: string
          locale?: string
          onboarding_completed?: boolean
          role?: string
          spiritual_mode?: Database["public"]["Enums"]["spiritual_mode"]
          theme?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      recovery_profiles: {
        Row: {
          accountability_preference: string | null
          checkin_time: string | null
          created_at: string
          current_frequency: string | null
          goals: string[]
          motivations: string | null
          reminders_enabled: boolean
          risk_end: string | null
          risk_start: string | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accountability_preference?: string | null
          checkin_time?: string | null
          created_at?: string
          current_frequency?: string | null
          goals?: string[]
          motivations?: string | null
          reminders_enabled?: boolean
          risk_end?: string | null
          risk_start?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accountability_preference?: string | null
          checkin_time?: string | null
          created_at?: string
          current_frequency?: string | null
          goals?: string[]
          motivations?: string | null
          reminders_enabled?: boolean
          risk_end?: string | null
          risk_start?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      relapse_events: {
        Row: {
          context: string | null
          created_at: string
          emotions: string[]
          id: string
          learning: string | null
          next_step: string | null
          occurred_at: string
          restart_barrier: string | null
          restart_next_24h_action: string | null
          restart_tomorrow_mission: string | null
          restart_what_happened: string | null
          trigger_summary: string | null
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          emotions?: string[]
          id?: string
          learning?: string | null
          next_step?: string | null
          occurred_at: string
          restart_barrier?: string | null
          restart_next_24h_action?: string | null
          restart_tomorrow_mission?: string | null
          restart_what_happened?: string | null
          trigger_summary?: string | null
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          emotions?: string[]
          id?: string
          learning?: string | null
          next_step?: string | null
          occurred_at?: string
          restart_barrier?: string | null
          restart_next_24h_action?: string | null
          restart_tomorrow_mission?: string | null
          restart_what_happened?: string | null
          trigger_summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relapse_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_items: {
        Row: {
          created_at: string
          id: string
          kind: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_scores: {
        Row: {
          calculated_at: string
          factors: Json
          id: string
          level: Database["public"]["Enums"]["risk_level"]
          score: number
          user_id: string
        }
        Insert: {
          calculated_at?: string
          factors?: Json
          id?: string
          level: Database["public"]["Enums"]["risk_level"]
          score: number
          user_id: string
        }
        Update: {
          calculated_at?: string
          factors?: Json
          id?: string
          level?: Database["public"]["Enums"]["risk_level"]
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sos_sessions: {
        Row: {
          completed: boolean
          duration_seconds: number | null
          environment: string | null
          final_intensity: number | null
          finished_at: string | null
          id: string
          initial_intensity: number
          started_at: string
          strategies: string[]
          user_id: string
        }
        Insert: {
          completed?: boolean
          duration_seconds?: number | null
          environment?: string | null
          final_intensity?: number | null
          finished_at?: string | null
          id?: string
          initial_intensity: number
          started_at?: string
          strategies?: string[]
          user_id: string
        }
        Update: {
          completed?: boolean
          duration_seconds?: number | null
          environment?: string | null
          final_intensity?: number | null
          finished_at?: string | null
          id?: string
          initial_intensity?: number
          started_at?: string
          strategies?: string[]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_requests: {
        Row: {
          acknowledged_at: string | null
          id: string
          message: string
          owner_id: string
          relationship_id: string
          requested_at: string
          resolved_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          id?: string
          message?: string
          owner_id: string
          relationship_id: string
          requested_at?: string
          resolved_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          id?: string
          message?: string
          owner_id?: string
          relationship_id?: string
          requested_at?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_requests_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "accountability_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      triggers: {
        Row: {
          created_at: string
          id: string
          kind: string
          label: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          label: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          label?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "triggers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      urges: {
        Row: {
          alone: boolean | null
          associated_platform: string | null
          attention_zone_id: string | null
          context: string | null
          created_at: string
          emotion: string | null
          id: string
          intensity: number
          location_context: string | null
          occurred_at: string
          outcome: string | null
          protection_strategy: string | null
          response_taken: string | null
          thought: string | null
          user_id: string
        }
        Insert: {
          alone?: boolean | null
          associated_platform?: string | null
          attention_zone_id?: string | null
          context?: string | null
          created_at?: string
          emotion?: string | null
          id?: string
          intensity: number
          location_context?: string | null
          occurred_at?: string
          outcome?: string | null
          protection_strategy?: string | null
          response_taken?: string | null
          thought?: string | null
          user_id: string
        }
        Update: {
          alone?: boolean | null
          associated_platform?: string | null
          attention_zone_id?: string | null
          context?: string | null
          created_at?: string
          emotion?: string | null
          id?: string
          intensity?: number
          location_context?: string | null
          occurred_at?: string
          outcome?: string | null
          protection_strategy?: string | null
          response_taken?: string | null
          thought?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "urges_attention_zone_id_fkey"
            columns: ["attention_zone_id"]
            isOneToOne: false
            referencedRelation: "attention_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "urges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_accountability_invite: {
        Args: { p_partner_id: string; p_token_hash: string }
        Returns: string
      }
      accountability_partner_snapshot: {
        Args: { p_relationship_id: string }
        Returns: Json
      }
      award_presence_xp: {
        Args: { p_source: string; p_source_key: string }
        Returns: boolean
      }
      award_private_milestones: {
        Args: never
        Returns: {
          achievement_id: string
        }[]
      }
      complete_onboarding: {
        Args: { p_payload: Json; p_user_id: string }
        Returns: undefined
      }
      complete_power_up: {
        Args: { p_activity_id: string; p_local_date: string }
        Returns: boolean
      }
    }
    Enums: {
      relationship_status: "pending" | "active" | "revoked" | "declined"
      risk_level: "low" | "moderate" | "high" | "critical"
      spiritual_mode: "off" | "christian" | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      relationship_status: ["pending", "active", "revoked", "declined"],
      risk_level: ["low", "moderate", "high", "critical"],
      spiritual_mode: ["off", "christian", "custom"],
    },
  },
} as const
