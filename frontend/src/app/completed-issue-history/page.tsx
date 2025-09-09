"use client"
import CompletedIssueHistoryLayout from "./components/CompletedIssueHistoryLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function CompletedIssueHistoryPage() {
  return (
    <ProtectedRoute>
      <CompletedIssueHistoryLayout />
    </ProtectedRoute>
  )
}
