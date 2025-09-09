"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  getCurrentUserRole, 
  hasPageAccess, 
  isAuthenticated, 
  getRoleName,
  type RoleId 
} from "@/utils/roleUtils"

export function useRoleAccess() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const [userRole, setUserRole] = useState<RoleId | null>(null)

  useEffect(() => {
    const checkAccess = () => {
      // Get current page name from pathname (remove leading slash)
      const pageName = pathname.replace("/", "") || "dashboard"
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        // If not authenticated and trying to access protected page, redirect to login
        if (pageName !== "login" && pageName !== "register") {
          router.push("/login")
          return
        }
      }
      
      // Get user role
      const role = getCurrentUserRole()
      setUserRole(role)
      
      // Check if user has access to current page
      const access = hasPageAccess(pageName, role)
      setHasAccess(access)
      
      // If no access, redirect to unauthorized page
      if (!access && pageName !== "unauthorized") {
        router.push("/unauthorized")
        return
      }
      
      setIsLoading(false)
    }

    checkAccess()
  }, [pathname, router])

  return {
    isLoading,
    hasAccess,
    userRole,
    roleName: userRole ? getRoleName(userRole) : null,
    isAuthenticated: isAuthenticated()
  }
}
