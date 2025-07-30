"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OpportunityCard } from "@/components/opportunity-card"
import { fetchOpportunities } from "@/lib/api"
import type { Opportunity } from "@/types/opportunity"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Create a separate component for the auth section
function AuthSection() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // Check for user in localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser && typeof parsedUser === "object") {
            setUser(parsedUser)
          }
        } catch (error) {
          console.error("Error parsing user data:", error)
          // Clear invalid data
          localStorage.removeItem("user")
          localStorage.removeItem("accessToken")
        }
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
      setUser(null)
      // Refresh the page to update the UI
      window.location.reload()
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Welcome, {user.name || user.email || "User"}</span>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      ) : (
        <>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </>
      )}
    </div>
  )
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("most-relevant")

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true)
        const response = await fetchOpportunities()
        if (response.success) {
          setOpportunities(response.data)
        } else {
          setError("Failed to fetch opportunities")
        }
      } catch (err) {
        setError("An error occurred while fetching opportunities")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadOpportunities()
  }, [])

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Authentication Section */}
        <div className="mb-6 flex justify-end">
          <AuthSection />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunities</h1>
            <p className="text-gray-600">Showing {opportunities.length} results</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most-relevant">Most relevant</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {sortedOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>

        {opportunities.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
