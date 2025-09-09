// Role IDs based on your database
export const ROLES = {
  STANAR: 1,
  UPRAVNIK: 2,
  IZVOĐAČ: 3,
  ADMINISTRATOR: 4
} as const

export type RoleId = typeof ROLES[keyof typeof ROLES]

// Page access permissions
export const PAGE_PERMISSIONS = {
  'admin': [ROLES.ADMINISTRATOR],
  'all-issues': [ROLES.UPRAVNIK],
  'my-assigned-issues': [ROLES.IZVOĐAČ],
  'assignment-notifications': [ROLES.IZVOĐAČ],
  'completed-issue-history': [ROLES.IZVOĐAČ],
  'contractordashboard': [ROLES.IZVOĐAČ],
  'contractorform': [], // svi (bez provjere)
  'dashboard': [ROLES.STANAR, ROLES.IZVOĐAČ], // Upravnik ne može pristupiti tenant dashboard-u
  'issue-history': [ROLES.STANAR, ROLES.IZVOĐAČ],
  'login': [], // svi (bez provjere)
  'managerdashboard': [ROLES.UPRAVNIK],
  'my-issues': [ROLES.STANAR, ROLES.IZVOĐAČ],
  'new-issue': [ROLES.STANAR, ROLES.IZVOĐAČ],
  'notifications': [ROLES.STANAR, ROLES.IZVOĐAČ],
  'other-issues': [ROLES.UPRAVNIK],
  'profile': [], // svi (bez provjere)
  'register': [], // svi (bez provjere)
  'survey': [ROLES.STANAR, ROLES.IZVOĐAČ],
  'tenants': [ROLES.UPRAVNIK],
  'unauthorized': [] // svi (bez provjere)
} as const

/**
 * Get user role ID from JWT token
 */
export function getRoleIdFromToken(token: string): RoleId | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.role_id || null
  } catch (e) {
    return null
  }
}

/**
 * Get current user role from localStorage
 */
export function getCurrentUserRole(): RoleId | null {
  if (typeof window === "undefined") return null
  
  const token = localStorage.getItem("auth_token")
  if (!token) return null
  
  return getRoleIdFromToken(token)
}

/**
 * Check if user has access to a specific page
 */
export function hasPageAccess(pageName: string, roleId?: RoleId | null): boolean {
  // If no role provided, get current user role
  if (roleId === undefined) {
    roleId = getCurrentUserRole()
  }
  
  // If still no role, deny access (except for public pages)
  if (!roleId) {
    const isPublic = PAGE_PERMISSIONS[pageName as keyof typeof PAGE_PERMISSIONS]?.length === 0
    return isPublic
  }
  
  const allowedRoles = PAGE_PERMISSIONS[pageName as keyof typeof PAGE_PERMISSIONS]
  
  // If no roles specified, it's a public page
  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }
  
  // Check if user role is in allowed roles
  const hasAccess = allowedRoles.some(role => role === roleId)
  return hasAccess
}

/**
 * Get dashboard route based on user role
 */
export function getDashboardRoute(roleId: RoleId): string {
  switch (roleId) {
    case ROLES.STANAR:
      return "/dashboard"
    case ROLES.UPRAVNIK:
      return "/managerdashboard"
    case ROLES.IZVOĐAČ:
      return "/dashboard"
    case ROLES.ADMINISTRATOR:
      return "/admin"
    default:
      return "/dashboard"
  }
}

/**
 * Get role name from role ID
 */
export function getRoleName(roleId: RoleId): string {
  switch (roleId) {
    case ROLES.STANAR:
      return "Stanar"
    case ROLES.UPRAVNIK:
      return "Upravnik"
    case ROLES.IZVOĐAČ:
      return "Izvođač"
    case ROLES.ADMINISTRATOR:
      return "Administrator"
    default:
      return "Nepoznato"
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  
  const token = localStorage.getItem("auth_token")
  if (!token) return false
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const exp = payload.exp * 1000 // Convert to milliseconds
    return Date.now() < exp
  } catch (e) {
    return false
  }
}

/**
 * Redirect to unauthorized page if user doesn't have access
 */
export function redirectIfNoAccess(pageName: string, router: any): boolean {
  if (!hasPageAccess(pageName)) {
    router.push("/unauthorized")
    return true
  }
  return false
}
