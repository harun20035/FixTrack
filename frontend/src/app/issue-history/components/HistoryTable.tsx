"use client"
import { useEffect, useState } from "react"
import type React from "react"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TablePagination from "@mui/material/TablePagination"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Rating from "@mui/material/Rating"
import { styled } from "@mui/material/styles"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CommentIcon from "@mui/icons-material/Comment"
import PersonIcon from "@mui/icons-material/Person"
import type { HistoryIssue, FilterOptions } from "../types"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const StyledTableContainer = styled(TableContainer)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
  "& .MuiTableCell-root": {
    borderColor: "#333",
    color: "inherit",
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: "#2a2a2a",
    fontWeight: 600,
    color: "#42a5f5",
  },
}))

interface HistoryTableProps {
  filters: FilterOptions;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

export default function HistoryTable({ filters, page, setPage, rowsPerPage, setRowsPerPage }: HistoryTableProps) {
  const [issues, setIssues] = useState<HistoryIssue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<HistoryIssue | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    const params = new URLSearchParams({
      search: filters.searchTerm,
      category: filters.category,
      status: filters.status,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      sort_by: filters.sortBy,
      page: (page + 1).toString(),
      page_size: rowsPerPage.toString(),
    });
    fetch(`http://localhost:8000/api/issue-history?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setIssues(data.issues || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [filters, page, rowsPerPage]);

  const getStatusColor = (status: string): 'success' | 'error' | 'primary' | 'warning' | 'default' => {
    switch (status) {
      case "Završeno":
        return "success"
      case "Odbijeno":
        return "error"
      case "U toku":
        return "primary"
      case "Čeka dijelove":
        return "warning"
      default:
        return "default"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Vodoinstalacije":
        return "#2196f3"
      case "Elektroinstalacije":
        return "#ff9800"
      case "Grijanje":
        return "#f44336"
      case "Lift":
        return "#9c27b0"
      case "Zajedničke Prostorije":
        return "#4caf50"
      case "Fasada":
        return "#795548"
      case "Krov":
        return "#607d8b"
      default:
        return "#42a5f5"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const paginatedIssues = issues;

  if (loading) {
    return <Card sx={{ background: "transparent", boxShadow: "none" }}><Box sx={{ minHeight: 300 }} /></Card>;
  }

  return (
    <Card sx={{ background: "transparent", boxShadow: "none" }}>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Naslov & Kategorija</TableCell>
              <TableCell>Lokacija</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Datum Prijave</TableCell>
              <TableCell>Datum Završetka</TableCell>
              <TableCell>Izvođač</TableCell>
              <TableCell>Komentari</TableCell>
              <TableCell>Ocjena</TableCell>
              <TableCell>Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedIssues.map((issue) => (
              <TableRow key={issue.id} sx={{ "&:hover": { backgroundColor: "#252525" } }}>
                <TableCell>
                  <Box>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {issue.title}
                    </Typography>
                    <Chip
                      label={issue.category}
                      size="small"
                      sx={{
                        backgroundColor: getCategoryColor(issue.category),
                        color: "white",
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {issue.location || "Nije specificirano"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={issue.status} color={getStatusColor(issue.status)} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{issue.createdAt ? formatDate(issue.createdAt) : "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{issue.completedAt ? formatDate(issue.completedAt) : "-"}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {issue.assignedTo ? (
                      <>
                        <PersonIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                        <Typography variant="body2">{issue.assignedTo}</Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Nije dodijeljeno
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CommentIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                    <Typography variant="body2">{issue.commentsCount}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {issue.rating ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating value={issue.rating} readOnly size="small" precision={0.1} />
                      <Typography variant="body2" color="text.secondary">
                        ({issue.rating})
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nije ocijenjeno
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title="Pogledaj detalje">
                    <IconButton size="small" sx={{ color: "#42a5f5" }} onClick={() => { setSelectedIssue(issue); setDetailsOpen(true); }}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          color: "text.secondary",
          "& .MuiTablePagination-selectIcon": {
            color: "#42a5f5",
          },
          "& .MuiTablePagination-actions button": {
            color: "#42a5f5",
          },
        }}
      />
      {/* Details Modal */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth disableEnforceFocus keepMounted>
        <DialogTitle>Detalji prijave</DialogTitle>
        <DialogContent dividers>
          {selectedIssue && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" color="primary">{selectedIssue.title}</Typography>
              <Typography variant="body1"><b>Kategorija:</b> {selectedIssue.category}</Typography>
              <Typography variant="body1"><b>Status:</b> {selectedIssue.status}</Typography>
              <Typography variant="body1"><b>Lokacija:</b> {selectedIssue.location || "Nije specificirano"}</Typography>
              <Typography variant="body1"><b>Datum prijave:</b> {selectedIssue.createdAt ? formatDate(selectedIssue.createdAt) : "-"}</Typography>
              <Typography variant="body1"><b>Broj komentara:</b> {selectedIssue.commentsCount}</Typography>
              <Typography variant="body1"><b>Ocjena:</b> {selectedIssue.rating ? selectedIssue.rating : "Nije ocijenjeno"}</Typography>
              <Typography variant="body1"><b>Detaljni opis:</b> {selectedIssue.description || "Nema dodatnog opisa."}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Zatvori</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
