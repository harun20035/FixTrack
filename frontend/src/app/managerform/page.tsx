"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import ManagerFormLayout from "./components/ManagerFormLayout"
import ManagerApplicationForm from "./components/ManagerApplicationForm"

export default function ManagerFormPage() {
  return (
    <ManagerFormLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ManagerApplicationForm />
        </Box>
      </Container>
    </ManagerFormLayout>
  )
}
