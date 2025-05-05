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
      accounts: {
        Row: {
          id: string
          created_at: string
          level: number
          likes: number
          platform: string
          price: number
          details: string
          seller_id: string
          outfits: string[]
          outfit_count: number
          diamonds: number
          featured: boolean
          images: string[]
          sold: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          level: number
          likes: number
          platform: string
          price: number
          details: string
          seller_id: string
          outfits?: string[]
          outfit_count: number
          diamonds: number
          featured?: boolean
          images: string[]
          sold?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          level?: number
          likes?: number
          platform?: string
          price?: number
          details?: string
          seller_id?: string
          outfits?: string[]
          outfit_count?: number
          diamonds?: number
          featured?: boolean
          images?: string[]
          sold?: boolean
        }
      }
      sellers: {
        Row: {
          id: string
          created_at: string
          name: string
          rating: number
          verified: boolean
          account_count: number
          image: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          rating?: number
          verified?: boolean
          account_count?: number
          image?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          rating?: number
          verified?: boolean
          account_count?: number
          image?: string
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          name: string
          rating: number
          comment: string
          avatar: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          rating: number
          comment: string
          avatar?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          rating?: number
          comment?: string
          avatar?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}