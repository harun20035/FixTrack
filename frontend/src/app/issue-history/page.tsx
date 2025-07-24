"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import IssueHistoryLayout from "./components/IssueHistoryLayout"
import HistoryFilters from "./components/HistoryFilters"
import HistoryStats from "./components/HistoryStats"
import HistoryTable from "./components/HistoryTable"
import { useState } from "react"
import type { FilterOptions } from "./types"

export default function IssueHistoryPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    category: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "created_at_desc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <IssueHistoryLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <HistoryStats filters={filters} />
          <HistoryFilters filters={filters} setFilters={setFilters} />
          <HistoryTable
            filters={filters}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </Box>
      </Container>
    </IssueHistoryLayout>
  )
}
