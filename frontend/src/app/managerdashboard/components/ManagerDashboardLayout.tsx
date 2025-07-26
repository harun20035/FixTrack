"use client"
import { useState } from "react"
import type React from "react"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import DashboardIcon from "@mui/icons-material/Dashboard"
import ListAltIcon from "@mui/icons-material/ListAlt"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import ListIcon from "@mui/icons-material/List"
import BarChartIcon from "@mui/icons-material/BarChart"
import PeopleIcon from "@mui/icons-material/People"
import BuildIcon from "@mui/icons-material/Build"
import ChatIcon from "@mui/icons-material/Chat"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { useRouter, usePathname } from "next/navigation"
import ManagerSidebar, {
  drawerWidth,
  type MenuItem,
  type UserInfo,
} from "../../../../src/components/sidebar/ManagerSidebar"

interface ManagerDashboardLayoutProps {
  children: React.ReactNode
}

export default function ManagerDashboardLayout({ children }: ManagerDashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    router.push("/")
  }

  const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/managerdashboard" },
    { text: "Sve Prijave - Primljeno", icon: <ListAltIcon />, path: "/all-issues" },
    { text: "Sve Prijave - Ostalo", icon: <ListIcon />, path: "/other-issues" },
    { text: "Statistike", icon: <BarChartIcon />, path: "/managerdashboard/statistics" },
    { text: "Stanari", icon: <PeopleIcon />, path: "/managerdashboard/tenants" },
    { text: "Izvođači", icon: <BuildIcon />, path: "/managerdashboard/contractors" },
    { text: "Komunikacija", icon: <ChatIcon />, path: "/managerdashboard/communication" },
    { text: "Notifikacije", icon: <NotificationsIcon />, path: "/managerdashboard/notifications" },
  ]

  const userInfo: UserInfo = {
    name: "Marko Petrović",
    role: "Upravnik",
    avatar: "MP",
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212" }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { sm: "none" },
          backgroundColor: "#181818",
          borderBottom: "1px solid #333",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="primary">
            FixTrack Upravnik Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <ManagerSidebar
        menuItems={menuItems}
        currentPath={pathname}
        userInfo={userInfo}
        mobileOpen={mobileOpen}
        onMobileToggle={handleDrawerToggle}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: "64px", sm: 0 },
          backgroundColor: "#121212",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
