"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import ContractorFormLayout from "./components/ContractorFormLayout"
import ContractorApplicationForm from "./components/ContractorApplicationForm"

export default function ContractorFormPage() {
  return (
    <ContractorFormLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ContractorApplicationForm />
        </Box>
      </Container>
    </ContractorFormLayout>
  )
}
