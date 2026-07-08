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
      ai_recommendations: {
        Row: {
          client_id: string
          confidence: number | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["ai_rec_kind"]
          reasoning: string
          resolved_at: string | null
          source_data: Json
          status: Database["public"]["Enums"]["ai_rec_status"]
          summary: string
          trainer_action_note: string | null
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          confidence?: number | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["ai_rec_kind"]
          reasoning: string
          resolved_at?: string | null
          source_data?: Json
          status?: Database["public"]["Enums"]["ai_rec_status"]
          summary: string
          trainer_action_note?: string | null
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          confidence?: number | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["ai_rec_kind"]
          reasoning?: string
          resolved_at?: string | null
          source_data?: Json
          status?: Database["public"]["Enums"]["ai_rec_status"]
          summary?: string
          trainer_action_note?: string | null
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      body_metrics: {
        Row: {
          body_fat_pct: number | null
          client_id: string
          created_at: string
          custom: Json | null
          id: string
          measured_on: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          body_fat_pct?: number | null
          client_id: string
          created_at?: string
          custom?: Json | null
          id?: string
          measured_on: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          body_fat_pct?: number | null
          client_id?: string
          created_at?: string
          custom?: Json | null
          id?: string
          measured_on?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "body_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          checked_in_on: string
          client_id: string
          comment: string | null
          created_at: string
          energy: number | null
          id: string
          mood: number | null
          motivation: number | null
          pain_note: string | null
          sleep_hours: number | null
          sleep_quality: number | null
          soreness: number | null
          stress: number | null
          updated_at: string
        }
        Insert: {
          checked_in_on: string
          client_id: string
          comment?: string | null
          created_at?: string
          energy?: number | null
          id?: string
          mood?: number | null
          motivation?: number | null
          pain_note?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
          updated_at?: string
        }
        Update: {
          checked_in_on?: string
          client_id?: string
          comment?: string | null
          created_at?: string
          energy?: number | null
          id?: string
          mood?: number | null
          motivation?: number | null
          pain_note?: string | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          soreness?: number | null
          stress?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          created_at: string
          equipment_notes: string | null
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          goal: string | null
          height_cm: number | null
          id: string
          injuries: string | null
          schedule_notes: string | null
          unit_preference: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          equipment_notes?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          goal?: string | null
          height_cm?: number | null
          id: string
          injuries?: string | null
          schedule_notes?: string | null
          unit_preference?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          equipment_notes?: string | null
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          goal?: string | null
          height_cm?: number | null
          id?: string
          injuries?: string | null
          schedule_notes?: string | null
          unit_preference?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_routine_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          position: number
          reps_target: string | null
          routine_id: string
          target_sets: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          position: number
          reps_target?: string | null
          routine_id: string
          target_sets?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          position?: number
          reps_target?: string | null
          routine_id?: string
          target_sets?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_routine_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_routine_exercises_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "client_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      client_routines: {
        Row: {
          client_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_routines_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_media: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          source: string | null
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          kind: Database["public"]["Enums"]["media_kind"]
          source?: string | null
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          source?: string | null
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_media_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: Database["public"]["Enums"]["exercise_category"]
          created_at: string
          equipment: string | null
          id: string
          instructions: string | null
          is_public: boolean
          name: string
          owner_trainer_id: string | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["exercise_category"]
          created_at?: string
          equipment?: string | null
          id?: string
          instructions?: string | null
          is_public?: boolean
          name: string
          owner_trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["exercise_category"]
          created_at?: string
          equipment?: string | null
          id?: string
          instructions?: string | null
          is_public?: boolean
          name?: string
          owner_trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_owner_trainer_id_fkey"
            columns: ["owner_trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          status: Database["public"]["Enums"]["invitation_status"]
          token: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at: string
          id?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_logs: {
        Row: {
          calories: number | null
          carbs_g: number | null
          client_id: string
          created_at: string
          fat_g: number | null
          id: string
          logged_at: string
          notes: string | null
          protein_g: number | null
          title: string
          updated_at: string
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          client_id: string
          created_at?: string
          fat_g?: number | null
          id?: string
          logged_at?: string
          notes?: string | null
          protein_g?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          client_id?: string
          created_at?: string
          fat_g?: number | null
          id?: string
          logged_at?: string
          notes?: string | null
          protein_g?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_photos: {
        Row: {
          created_at: string
          id: string
          meal_log_id: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_log_id: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_log_id?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_photos_meal_log_id_fkey"
            columns: ["meal_log_id"]
            isOneToOne: false
            referencedRelation: "meal_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      message_threads: {
        Row: {
          client_id: string
          created_at: string
          id: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
          thread_id: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
          thread_id: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
          thread_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          emailed_at: string | null
          id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          link_path: string | null
          read_at: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          emailed_at?: string | null
          id?: string
          kind: Database["public"]["Enums"]["notification_kind"]
          link_path?: string | null
          read_at?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          emailed_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          link_path?: string | null
          read_at?: string | null
          title?: string
          updated_at?: string
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
      nutrition_targets: {
        Row: {
          calories: number | null
          carbs_g: number | null
          client_id: string
          created_at: string
          effective_from: string
          fat_g: number | null
          id: string
          notes: string | null
          protein_g: number | null
          trainer_id: string
          updated_at: string
          water_ml: number | null
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          client_id: string
          created_at?: string
          effective_from: string
          fat_g?: number | null
          id?: string
          notes?: string | null
          protein_g?: number | null
          trainer_id: string
          updated_at?: string
          water_ml?: number | null
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          client_id?: string
          created_at?: string
          effective_from?: string
          fat_g?: number | null
          id?: string
          notes?: string | null
          protein_g?: number | null
          trainer_id?: string
          updated_at?: string
          water_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_targets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrition_targets_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_records: {
        Row: {
          achieved_at: string
          client_id: string
          created_at: string
          exercise_id: string
          id: string
          kind: Database["public"]["Enums"]["pr_kind"]
          set_log_id: string | null
          updated_at: string
          value: number
        }
        Insert: {
          achieved_at?: string
          client_id: string
          created_at?: string
          exercise_id: string
          id?: string
          kind: Database["public"]["Enums"]["pr_kind"]
          set_log_id?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          achieved_at?: string
          client_id?: string
          created_at?: string
          exercise_id?: string
          id?: string
          kind?: Database["public"]["Enums"]["pr_kind"]
          set_log_id?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "personal_records_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_records_set_log_id_fkey"
            columns: ["set_log_id"]
            isOneToOne: false
            referencedRelation: "set_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      program_assignments: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          program_id: string
          start_date: string
          status: Database["public"]["Enums"]["assignment_status"]
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          program_id: string
          start_date: string
          status?: Database["public"]["Enums"]["assignment_status"]
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          program_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["assignment_status"]
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_assignments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_assignments_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      program_day_exercises: {
        Row: {
          allows_substitution: boolean
          created_at: string
          day_id: string
          exercise_id: string
          id: string
          notes: string | null
          position: number
          reps_target: string
          rest_seconds: number | null
          rpe_target: number | null
          sets: number
          updated_at: string
        }
        Insert: {
          allows_substitution?: boolean
          created_at?: string
          day_id: string
          exercise_id: string
          id?: string
          notes?: string | null
          position: number
          reps_target: string
          rest_seconds?: number | null
          rpe_target?: number | null
          sets: number
          updated_at?: string
        }
        Update: {
          allows_substitution?: boolean
          created_at?: string
          day_id?: string
          exercise_id?: string
          id?: string
          notes?: string | null
          position?: number
          reps_target?: string
          rest_seconds?: number | null
          rpe_target?: number | null
          sets?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_day_exercises_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_day_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      program_days: {
        Row: {
          created_at: string
          day_index: number
          id: string
          name: string | null
          updated_at: string
          week_id: string
        }
        Insert: {
          created_at?: string
          day_index: number
          id?: string
          name?: string | null
          updated_at?: string
          week_id: string
        }
        Update: {
          created_at?: string
          day_index?: number
          id?: string
          name?: string | null
          updated_at?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_days_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "program_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      program_weeks: {
        Row: {
          created_at: string
          id: string
          label: string | null
          program_id: string
          updated_at: string
          week_index: number
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          program_id: string
          updated_at?: string
          week_index: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          program_id?: string
          updated_at?: string
          week_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "program_weeks_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          trainer_id: string
          updated_at: string
          weeks_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          trainer_id: string
          updated_at?: string
          weeks_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          trainer_id?: string
          updated_at?: string
          weeks_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "programs_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_photos: {
        Row: {
          client_id: string
          created_at: string
          id: string
          pose: Database["public"]["Enums"]["photo_pose"]
          storage_path: string
          taken_on: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          pose?: Database["public"]["Enums"]["photo_pose"]
          storage_path: string
          taken_on: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          pose?: Database["public"]["Enums"]["photo_pose"]
          storage_path?: string
          taken_on?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      set_logs: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          is_pr: boolean
          pain_note: string | null
          program_day_exercise_id: string | null
          reps: number | null
          rpe: number | null
          session_id: string
          set_index: number
          substituted_exercise_id: string | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          is_pr?: boolean
          pain_note?: string | null
          program_day_exercise_id?: string | null
          reps?: number | null
          rpe?: number | null
          session_id: string
          set_index: number
          substituted_exercise_id?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          is_pr?: boolean
          pain_note?: string | null
          program_day_exercise_id?: string | null
          reps?: number | null
          rpe?: number | null
          session_id?: string
          set_index?: number
          substituted_exercise_id?: string | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "set_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_program_day_exercise_id_fkey"
            columns: ["program_day_exercise_id"]
            isOneToOne: false
            referencedRelation: "program_day_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "set_logs_substituted_exercise_id_fkey"
            columns: ["substituted_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_clients: {
        Row: {
          client_id: string
          created_at: string
          ended_at: string | null
          id: string
          started_at: string | null
          status: Database["public"]["Enums"]["relationship_status"]
          trainer_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["relationship_status"]
          trainer_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["relationship_status"]
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_clients_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_clients_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_profiles: {
        Row: {
          bio: string | null
          business_name: string | null
          created_at: string
          id: string
          specialties: string[]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          business_name?: string | null
          created_at?: string
          id: string
          specialties?: string[]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          business_name?: string | null
          created_at?: string
          id?: string
          specialties?: string[]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      water_logs: {
        Row: {
          client_id: string
          created_at: string
          id: string
          logged_on: string
          total_ml: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          logged_on: string
          total_ml: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          logged_on?: string
          total_ml?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          assignment_id: string | null
          client_id: string
          client_notes: string | null
          completed_at: string | null
          created_at: string
          id: string
          program_day_id: string | null
          routine_id: string | null
          scheduled_date: string
          session_rpe: number | null
          skipped_reason: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["session_status"]
          title: string | null
          updated_at: string
        }
        Insert: {
          assignment_id?: string | null
          client_id: string
          client_notes?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          program_day_id?: string | null
          routine_id?: string | null
          scheduled_date: string
          session_rpe?: number | null
          skipped_reason?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string | null
          client_id?: string
          client_notes?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          program_day_id?: string | null
          routine_id?: string | null
          scheduled_date?: string
          session_rpe?: number | null
          skipped_reason?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "program_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_program_day_id_fkey"
            columns: ["program_day_id"]
            isOneToOne: false
            referencedRelation: "program_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "client_routines"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: { Args: { _token: string }; Returns: string }
      assign_program: {
        Args: {
          _client_id: string
          _notes?: string
          _program_id: string
          _start_date: string
        }
        Returns: number
      }
      can_read_exercise: {
        Args: { _exercise: string; _user: string }
        Returns: boolean
      }
      client_has_assignment: {
        Args: { _client: string; _program: string }
        Returns: boolean
      }
      complete_workout_session: {
        Args: {
          _client_notes?: string
          _session_id: string
          _session_rpe?: number
        }
        Returns: {
          exercise_id: string
          exercise_name: string
          kind: Database["public"]["Enums"]["pr_kind"]
          value: number
        }[]
      }
      create_invitation: {
        Args: { _email: string }
        Returns: {
          expires_at: string
          invitation_id: string
          token: string
        }[]
      }
      day_program: { Args: { _day: string }; Returns: string }
      email_for_user: { Args: { _user: string }; Returns: string }
      get_invitation: {
        Args: { _token: string }
        Returns: {
          email: string
          status: Database["public"]["Enums"]["invitation_status"]
          trainer_name: string
        }[]
      }
      is_linked_trainer: {
        Args: { _client: string; _trainer: string }
        Returns: boolean
      }
      is_thread_participant: {
        Args: { _thread: string; _user: string }
        Returns: boolean
      }
      is_trainer: { Args: { _user: string }; Returns: boolean }
      meal_log_client: { Args: { _meal_log: string }; Returns: string }
      program_trainer: { Args: { _program: string }; Returns: string }
      routine_client: { Args: { _routine: string }; Returns: string }
      save_solo_set: {
        Args: {
          _exercise_id: string
          _pain_note?: string
          _reps?: number
          _rpe?: number
          _session_id: string
          _set_index: number
          _weight_kg?: number
        }
        Returns: undefined
      }
      session_client: { Args: { _session: string }; Returns: string }
      storage_path_owner: { Args: { _name: string }; Returns: string }
      week_program: { Args: { _week: string }; Returns: string }
    }
    Enums: {
      ai_rec_kind:
        | "push_harder"
        | "maintain"
        | "reduce_volume"
        | "deload"
        | "nutrition_adherence"
        | "increase_protein"
        | "increase_calories"
        | "emotional_check_in"
        | "review_technique"
        | "change_exercise"
        | "celebrate_progress"
        | "escalate"
      ai_rec_status: "pending" | "approved" | "edited" | "dismissed"
      assignment_status: "active" | "completed" | "cancelled"
      exercise_category:
        | "squat"
        | "hinge"
        | "lunge"
        | "push_horizontal"
        | "push_vertical"
        | "pull_horizontal"
        | "pull_vertical"
        | "carry"
        | "core"
        | "cardio"
        | "mobility"
        | "plyometric"
        | "olympic"
        | "isolation"
        | "other"
      experience_level: "beginner" | "intermediate" | "advanced" | "athlete"
      invitation_status: "pending" | "accepted" | "expired" | "revoked"
      media_kind: "image" | "video"
      notification_kind:
        | "workout_assigned"
        | "workout_reminder"
        | "checkin_missed"
        | "nutrition_reminder"
        | "message_received"
        | "session_reminder"
        | "nudge_approved"
        | "pr_achieved"
        | "system"
      photo_pose: "front" | "side" | "back" | "other"
      pr_kind: "weight" | "reps" | "volume" | "e1rm"
      relationship_status: "invited" | "active" | "paused" | "ended"
      session_status: "pending" | "in_progress" | "completed" | "skipped"
      user_role: "trainer" | "client"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      ai_rec_kind: [
        "push_harder",
        "maintain",
        "reduce_volume",
        "deload",
        "nutrition_adherence",
        "increase_protein",
        "increase_calories",
        "emotional_check_in",
        "review_technique",
        "change_exercise",
        "celebrate_progress",
        "escalate",
      ],
      ai_rec_status: ["pending", "approved", "edited", "dismissed"],
      assignment_status: ["active", "completed", "cancelled"],
      exercise_category: [
        "squat",
        "hinge",
        "lunge",
        "push_horizontal",
        "push_vertical",
        "pull_horizontal",
        "pull_vertical",
        "carry",
        "core",
        "cardio",
        "mobility",
        "plyometric",
        "olympic",
        "isolation",
        "other",
      ],
      experience_level: ["beginner", "intermediate", "advanced", "athlete"],
      invitation_status: ["pending", "accepted", "expired", "revoked"],
      media_kind: ["image", "video"],
      notification_kind: [
        "workout_assigned",
        "workout_reminder",
        "checkin_missed",
        "nutrition_reminder",
        "message_received",
        "session_reminder",
        "nudge_approved",
        "pr_achieved",
        "system",
      ],
      photo_pose: ["front", "side", "back", "other"],
      pr_kind: ["weight", "reps", "volume", "e1rm"],
      relationship_status: ["invited", "active", "paused", "ended"],
      session_status: ["pending", "in_progress", "completed", "skipped"],
      user_role: ["trainer", "client"],
    },
  },
} as const
