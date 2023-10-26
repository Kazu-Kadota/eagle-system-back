export interface RecoveryPasswordKey {
  recovery_id: string
}

export interface RecoveryPasswordBody {
  user_id: string
  expires_at: string
}

export interface RecoveryPassword extends RecoveryPasswordKey, RecoveryPasswordBody {}
