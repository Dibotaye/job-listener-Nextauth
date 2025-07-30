export interface Opportunity {
  id: string
  title: string
  description: string
  responsibilities: string
  requirements: string
  whenAndWhere: string
  orgName: string
  logoUrl: string
  opType: string
  startDate: string
  endDate: string
  deadline: string
  location: string[]
  requiredSkills: string[]
  categories: string[]
  perksAndBenefits?: string
  idealCandidate?: string
  createdAt: string
  updatedAt: string
  orgPrimaryPhone?: string
  orgEmail?: string
  average_rating?: number
  total_reviews?: number
}

export interface OpportunityResponse {
  success: boolean
  message: string
  data: Opportunity[]
  errors?: any
  count: number
}

export interface SingleOpportunityResponse {
  success: boolean
  message: string
  data: Opportunity
  errors?: any
}
