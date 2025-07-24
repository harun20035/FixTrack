"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import MyIssuesLayout from "./components/MyIssuesLayout"
import IssuesList from "./components/IssuesList"

export default function MyIssuesPage() {
  return (
    <MyIssuesLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <IssuesList />
        </Box>
      </Container>
    </MyIssuesLayout>
  )
}
