import type {
  SignupRequest,
  SignupResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/auth"

const BASE_URL = "https://akil-backend.onrender.com"

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

export async function verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  try {
    const response = await fetch(`${BASE_URL}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Email verification error:", error)
    throw error
  }
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}
