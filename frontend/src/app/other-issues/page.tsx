"use client"
import { OtherIssuesLayout } from "./components/OtherIssuesLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function OtherIssuesPage() {
  return (
    <ProtectedRoute>
      <OtherIssuesLayout />
    </ProtectedRoute>
  )
}
