export interface SignupRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

export interface SignupResponse {
  success: boolean
  message: string
  data?: {
    email: string
    role: string
  }
}

export interface VerifyEmailRequest {
  email: string
  OTP: string
}

export interface VerifyEmailResponse {
  success: boolean
  message: string
  data?: any
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      name: string
      email: string
      role: string
    }
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}
