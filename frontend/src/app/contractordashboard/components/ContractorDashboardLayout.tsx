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
import AssignmentIcon from "@mui/icons-material/Assignment"
import NewReleasesIcon from "@mui/icons-material/NewReleases"
import HistoryIcon from "@mui/icons-material/History"
import FolderIcon from "@mui/icons-material/Folder"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { useRouter, usePathname } from "next/navigation"
import ContractorSidebar, { drawerWidth, type MenuItem } from "../../../components/sidebar/ContractorSidebar"

interface ContractorDashboardLayoutProps {
  children: React.ReactNode
}

export default function ContractorDashboardLayout({ children }: ContractorDashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleBack = () => {
    router.back()
  }

  const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/contractordashboard" },
    { text: "Dodijeljene Prijave", icon: <AssignmentIcon />, path: "/dashboard/contractordashboard/assigned" },
    { text: "Nova Zaduženja", icon: <NewReleasesIcon />, path: "/dashboard/contractordashboard/new-tasks" },
    { text: "Historija", icon: <HistoryIcon />, path: "/dashboard/contractordashboard/history" },
    { text: "Dokumentacija", icon: <FolderIcon />, path: "/dashboard/contractordashboard/documents" },
    { text: "Notifikacije", icon: <NotificationsIcon />, path: "/dashboard/contractordashboard/notifications" },
  ]

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
            Izvođač Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <ContractorSidebar
        menuItems={menuItems}
        currentPath={pathname}
        mobileOpen={mobileOpen}
        onMobileToggle={handleDrawerToggle}
        onLogout={handleLogout}
        onBack={handleBack}
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
