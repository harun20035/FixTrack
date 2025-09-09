"use client"

import AdminLayout from "./components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  )
}
