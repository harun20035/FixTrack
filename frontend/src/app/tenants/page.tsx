"use client"

import TenantsLayout from "./components/TenantsLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function TenantsPage() {
  return (
    <ProtectedRoute>
      <TenantsLayout />
    </ProtectedRoute>
  )
}
