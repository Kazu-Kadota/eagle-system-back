export interface PasswordHistoryKey {
  user_id: string
  created_at: string
}

export interface PasswordHistoryBody {
  old_password: string
  new_password: string
}

export interface PasswordHistory extends PasswordHistoryKey, PasswordHistoryBody {}
