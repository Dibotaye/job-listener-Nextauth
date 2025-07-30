import type { OpportunityResponse, SingleOpportunityResponse } from "@/types/opportunity"

const BASE_URL = "https://akil-backend.onrender.com"

export async function fetchOpportunities(): Promise<OpportunityResponse> {
  try {
    const response = await fetch(`${BASE_URL}/opportunities/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching opportunities:", error)
    throw error
  }
}

export async function fetchOpportunityById(id: string): Promise<SingleOpportunityResponse> {
  try {
    const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching opportunity:", error)
    throw error
  }
}
