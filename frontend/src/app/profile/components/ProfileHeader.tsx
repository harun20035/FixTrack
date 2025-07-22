"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"

const ProfileCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 16,
}))

interface UserProfile {
  id: number
  fullName: string
  email: string
  phone?: string
  address?: string
  role: string
  createdAt: string
}

export default function ProfileHeader() {
  // Mock data - u stvarnoj aplikaciji bi se dobijalo iz API-ja
  const userProfile: UserProfile = {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+387 33 123 456",
    address: "Sarajevo, BiH",
    role: "Stanar",
    createdAt: "2024-01-15",
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "stanar":
        return "primary"
      case "upravnik":
        return "secondary"
      case "izvođač":
        return "warning"
      case "administrator":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <ProfileCard>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#42a5f5",
              fontSize: "2rem",
              fontWeight: 600,
            }}
          >
            {getInitials(userProfile.fullName)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {userProfile.fullName}
              </Typography>
              <Chip
                label={userProfile.role}
                color={getRoleColor(userProfile.role) as "primary" | "secondary" | "warning" | "error" | "default"}
                variant="outlined"
                size="small"
              />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {userProfile.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Član od: {new Date(userProfile.createdAt).toLocaleDateString("bs-BA")}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 2,
            pt: 2,
            borderTop: "1px solid #333",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Telefon
            </Typography>
            <Typography variant="body1" color="primary">
              {userProfile.phone || "Nije uneseno"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Adresa
            </Typography>
            <Typography variant="body1" color="primary">
              {userProfile.address || "Nije uneseno"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </ProfileCard>
  )
}
