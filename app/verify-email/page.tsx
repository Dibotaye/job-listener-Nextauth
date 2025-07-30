"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { verifyEmail } from "@/lib/auth-api"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", ""])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Get email from localStorage only on client side
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("verificationEmail")
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        router.push("/signup")
      }
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")
    if (otpString.length !== 4) {
      setError("Please enter the complete verification code")
      return
    }

    setLoading(true)
    try {
      const response = await verifyEmail({
        email,
        OTP: otpString,
      })

      if (response.success) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("verificationEmail")
        }
        router.push("/login?verified=true")
      } else {
        setError(response.message || "Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return

    setCanResend(false)
    setResendTimer(30)
    setError("")

    // Start countdown again
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Here you would typically call a resend API endpoint
    console.log("Resending verification code to:", email)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Email</h1>
            <p className="text-gray-600 leading-relaxed">
              We've sent a verification code to the email address you provided. To complete the verification process,
              please enter the code here.
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-2xl font-semibold border-2 focus:border-indigo-500"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-2">
                You can request to{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend}
                  className={`font-medium ${
                    canResend
                      ? "text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Resend code
                </button>{" "}
                in
              </p>
              <p className="text-indigo-600 font-medium">{formatTime(resendTimer)}</p>
            </div>

            <Button
              type="submit"
              disabled={loading || otp.join("").length !== 4}
              className="w-full h-12 bg-indigo-400 hover:bg-indigo-500 text-white font-medium"
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
