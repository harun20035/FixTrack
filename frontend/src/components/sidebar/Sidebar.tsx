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
import Skeleton from "@mui/material/Skeleton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import BuildIcon from "@mui/icons-material/Build";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

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
  userInfo?: UserInfo | null
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
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchUnread = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        const count = Array.isArray(data) ? data.filter((n: any) => !n.is_read).length : 0;
        setUnreadCount(count);
      } catch {}
    };
    fetchUnread();
    interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

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
          {userInfo ? (
            <>
              <Avatar sx={{ bgcolor: "#42a5f5", mr: 2 }}>{userInfo.avatar}</Avatar>
              <Box>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                  {userInfo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userInfo.role}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box>
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="text" width={60} height={18} />
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={
                item.text.trim().toLowerCase() === "notifikacije"
                  ? () => router.push("/notifications")
                  : item.text.trim().toLowerCase() === "nova prijava"
                  ? () => router.push("/new-issue")
                  : item.text.trim().toLowerCase() === "moje prijave"
                  ? () => router.push("/my-issues")
                  : item.text.trim().toLowerCase() === "historija"
                  ? () => router.push("/issue-history")
                  : undefined
              }
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
              <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>
                {item.text.trim().toLowerCase() === "notifikacije" ? (
                  <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0} overlap="circular">
                    <NotificationsIcon />
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
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

      {/* Role upgrade dugmad */}
      {userInfo && (
        (userInfo.role === "Stanar") ? (
          <List sx={{ px: 2, py: 0 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push("/contractorform")}
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText primary="Postani izvođač" primaryTypographyProps={{ fontSize: "0.9rem" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push("/managerform")}
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Postani upravnik" primaryTypographyProps={{ fontSize: "0.9rem" }} />
              </ListItemButton>
            </ListItem>
          </List>
        ) : (userInfo.role.includes("Izvođač")) ? (
          <List sx={{ px: 2, py: 0 }}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push("/contractordashboard")}
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText primary="Izvođač dashboard" primaryTypographyProps={{ fontSize: "0.9rem" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push("/managerform")}
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "#42a5f5", minWidth: 40 }}>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText primary="Postani upravnik" primaryTypographyProps={{ fontSize: "0.9rem" }} />
              </ListItemButton>
            </ListItem>
          </List>
        ) : null
      )}

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
