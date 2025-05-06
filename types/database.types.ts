export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      renters: {
        Row: {
          id: string
          first_name: string
          last_name: string
          age: number
          occupation: string
          address: string
          email: string
          phone: string
          profile_picture: string
          rating: string
          member_since: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          age: number
          occupation: string
          address: string
          email: string
          phone: string
          profile_picture?: string
          rating?: string
          member_since?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          age?: number
          occupation?: string
          address?: string
          email?: string
          phone?: string
          profile_picture?: string
          rating?: string
          member_since?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          renter_id: string
          host_id: string
          host_name: string
          host_picture: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          renter_id: string
          host_id: string
          host_name: string
          host_picture: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          renter_id?: string
          host_id?: string
          host_name?: string
          host_picture?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      rental_history: {
        Row: {
          id: string
          renter_id: string
          car_model: string
          start_date: string
          end_date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          renter_id: string
          car_model: string
          start_date: string
          end_date: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          renter_id?: string
          car_model?: string
          start_date?: string
          end_date?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
} 