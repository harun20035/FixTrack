"use client"
import type React from "react"
import { useRouter } from "next/navigation"

import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Button from "@mui/material/Button"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

const drawerWidth = 280

interface MenuItem {
  text: string
  icon: React.ReactNode
  path: string
}

interface ContractorSidebarProps {
  menuItems: MenuItem[]
  currentPath: string
  mobileOpen: boolean
  onMobileToggle: () => void
  onLogout: () => void
  onBack: () => void
}

export default function ContractorSidebar({
  menuItems,
  currentPath,
  mobileOpen,
  onMobileToggle,
  onLogout,
  onBack,
}: ContractorSidebarProps) {
  const router = useRouter()

  const handleMenuClick = (path: string) => {
    router.push(path)
  }
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Back Button */}
      <Box sx={{ p: 3, borderBottom: "1px solid #333" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            color: "#42a5f5",
            "&:hover": {
              backgroundColor: "rgba(66, 165, 245, 0.1)",
            },
          }}
        >
          Nazad
        </Button>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleMenuClick(item.path)}
              sx={{
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(66, 165, 245, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(66, 165, 245, 0.3)",
                  },
                },
              }}
              selected={item.path === currentPath}
            >
              <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: item.path === currentPath ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "#333" }} />

      {/* Bottom Menu */}
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => handleMenuClick("/profile")}
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(66, 165, 245, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profil" primaryTypographyProps={{ fontSize: "0.9rem" }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(66, 165, 245, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Postavke" primaryTypographyProps={{ fontSize: "0.9rem" }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(244, 67, 54, 0.1)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#f44336", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Odjava" primaryTypographyProps={{ fontSize: "0.9rem", color: "#f44336" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#1a1a1a",
            borderRight: "1px solid #333",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#1a1a1a",
            borderRight: "1px solid #333",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export { drawerWidth }
export type { MenuItem }
