"use client"
import AllIssuesLayout from "./components/AllIssuesLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AllIssuesPage() {
  return (
    <ProtectedRoute>
      <AllIssuesLayout />
    </ProtectedRoute>
  )
}
