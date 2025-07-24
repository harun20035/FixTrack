"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import NewIssueLayout from "./components/NewIssueLayout"
import IssueForm from "./components/IssueForm"

export default function NewIssuePage() {
  return (
    <NewIssueLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <IssueForm />
        </Box>
      </Container>
    </NewIssueLayout>
  )
}
