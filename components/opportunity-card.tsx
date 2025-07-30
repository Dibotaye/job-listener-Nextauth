import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Opportunity } from "@/types/opportunity"

interface OpportunityCardProps {
  opportunity: Opportunity
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {opportunity.logoUrl ? (
                  <img
                    src={opportunity.logoUrl || "/placeholder.svg"}
                    alt={`${opportunity.orgName} logo`}
                    className="w-8 h-8 rounded"
                  />
                ) : (
                  <span className="text-gray-700 font-bold text-lg">{opportunity.orgName.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.title}</h3>

              <p className="text-sm text-gray-600 mb-2">
                {opportunity.orgName} • {opportunity.location.join(", ")}
              </p>

              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{opportunity.description}</p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                  {opportunity.opType}
                </Badge>

                {opportunity.categories.slice(0, 2).map((category, index) => (
                  <Badge key={index} variant="outline" className="text-orange-600 border-orange-200">
                    {category}
                  </Badge>
                ))}

                {opportunity.categories.length > 2 && (
                  <Badge variant="outline" className="text-gray-500">
                    +{opportunity.categories.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
