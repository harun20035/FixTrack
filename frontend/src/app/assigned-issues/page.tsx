"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import AssignedIssuesLayout from "./components/AssignedIssuesLayout"
import ContractorIssuesList from "./components/ContractorIssuesList"

export default function AssignedIssuesPage() {
  return (
    <AssignedIssuesLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ContractorIssuesList />
        </Box>
      </Container>
    </AssignedIssuesLayout>
  )
}
