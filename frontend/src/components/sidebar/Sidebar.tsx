"use client"
import type React from "react"

import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon"
import PersonIcon from "@mui/icons-material/Person"
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"
import { useRouter } from "next/navigation";

const drawerWidth = 280

function FixTrackIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="large">
      <circle cx="16" cy="16" r="15" fill="#42a5f5" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#111" />
    </SvgIcon>
  )
}

interface MenuItem {
  text: string
  icon: React.ReactNode
  path: string
}

interface UserInfo {
  name: string
  role: string
  avatar: string
}

interface SidebarProps {
  menuItems: MenuItem[]
  currentPath: string
  userInfo: UserInfo
  mobileOpen: boolean
  onMobileToggle: () => void
  onLogout: () => void
}

export default function Sidebar({
  menuItems,
  currentPath,
  userInfo,
  mobileOpen,
  onMobileToggle,
  onLogout,
}: SidebarProps) {
  const router = useRouter();
  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", borderBottom: "1px solid #333" }}>
        <FixTrackIcon sx={{ mr: 2 }} />
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          FixTrack
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 3, borderBottom: "1px solid #333" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: "#42a5f5", mr: 2 }}>{userInfo.avatar}</Avatar>
          <Box>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
              {userInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userInfo.role}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={item.text === "Nova Prijava" ? () => router.push("/new-issue") : undefined}
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
            onClick={() => router.push("/profile")}
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
            onClick={() => {
              localStorage.removeItem("auth_token");
              onLogout();
            }}
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
export type { MenuItem, UserInfo }
