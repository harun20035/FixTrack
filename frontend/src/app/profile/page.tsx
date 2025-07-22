"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import ProfileLayout from "./components/ProfileLayout"
import ProfileHeader from "./components/ProfileHeader"
import ProfileForm from "./components/ProfileForm"

export default function ProfilePage() {
  return (
    <ProfileLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ProfileHeader />
          <ProfileForm />
        </Box>
      </Container>
    </ProfileLayout>
  )
}
