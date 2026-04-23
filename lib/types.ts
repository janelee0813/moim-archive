export type UserStatus = 'pending' | 'approved' | 'rejected' | 'deactivated'

export interface Profile {
  id: string
  nickname: string
  email: string
  status: UserStatus
  is_admin: boolean
  created_at: string
  approved_at: string | null
  rejected_reason: string | null
}