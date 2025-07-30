"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle } from "lucide-react"
import { fetchOpportunityById } from "@/lib/api"
import type { Opportunity } from "@/types/opportunity"

export default function OpportunityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOpportunity = async () => {
      try {
        setLoading(true)
        const response = await fetchOpportunityById(params.id as string)
        if (response.success) {
          setOpportunity(response.data)
        } else {
          setError("Failed to fetch opportunity details")
        }
      } catch (err) {
        setError("An error occurred while fetching opportunity details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadOpportunity()
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-64"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Opportunity not found"}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to opportunities
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{opportunity.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <span>{opportunity.orgName}</span>
                <span>•</span>
                <span>{opportunity.location.join(", ")}</span>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{opportunity.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
                <div className="space-y-3">
                  {opportunity.responsibilities
                    .split("\n")
                    .filter(Boolean)
                    .map((responsibility, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{responsibility.replace(/^[•\-*]\s*/, "")}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {opportunity.idealCandidate && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Ideal Candidate we want</h2>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-gray-700">{opportunity.idealCandidate}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">When & Where</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                  <p className="text-gray-700">{opportunity.whenAndWhere}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Posted On</p>
                      <p className="font-medium">{formatDate(opportunity.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Deadline</p>
                      <p className="font-medium">{formatDate(opportunity.deadline)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{opportunity.location.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{formatDate(opportunity.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{formatDate(opportunity.endDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.categories.map((category, index) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600 border-blue-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
