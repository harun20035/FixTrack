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
import BuildIcon from "@mui/icons-material/Build"
import AddIcon from "@mui/icons-material/Add"
import HistoryIcon from "@mui/icons-material/History"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { useRouter, usePathname } from "next/navigation"
import Sidebar, { drawerWidth, type MenuItem, type UserInfo } from "../../../components/sidebar/Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Nova Prijava", icon: <AddIcon />, path: "/dashboard/new-report" },
    { text: "Moje Prijave", icon: <BuildIcon />, path: "/dashboard/my-reports" },
    { text: "Historija", icon: <HistoryIcon />, path: "/dashboard/history" },
    { text: "Notifikacije", icon: <NotificationsIcon />, path: "/dashboard/notifications" },
  ]

  const userInfo: UserInfo = {
    name: "John Doe",
    role: "Stanar - Stan 15",
    avatar: "JD",
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
            FixTrack Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
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
