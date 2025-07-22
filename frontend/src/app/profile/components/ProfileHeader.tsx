"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"

import type { UserProfile } from "../types";

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 16,
}))

export default function ProfileHeader({ profile }: ProfileHeaderProps) {

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
            {getInitials(profile.full_name)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {profile.full_name}
              </Typography>
              <Chip
                label={profile.role.name}
                color={getRoleColor(profile.role.name) as "primary" | "secondary" | "warning" | "error" | "default"}
                variant="outlined"
                size="small"
              />
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {profile.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
               clan od: {new Date(profile.created_at).toLocaleDateString("bs-BA")}
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
              {profile.phone || "Nije uneseno"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Adresa
            </Typography>
            <Typography variant="body1" color="primary">
              {profile.address || "Nije uneseno"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </ProfileCard>
  )
}
