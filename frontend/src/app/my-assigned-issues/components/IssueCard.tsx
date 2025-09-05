"use client"

import type React from "react"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import SyncIcon from "@mui/icons-material/Sync"
import { authFetch } from "@/utils/authFetch"
import type { Assignment } from "../types"

interface IssueCardProps {
  assignment: Assignment
  onStatusChange: (assignmentId: number, newStatus: string) => void
}

export default function IssueCard({ assignment, onStatusChange }: IssueCardProps) {
  // Provjeri da li assignment i issue postoje
  if (!assignment || !assignment.issue) {
    return (
      <Card sx={{ bgcolor: "#2a2a2a", border: "1px solid #333", p: 2 }}>
        <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
          Greška: Podaci nisu dostupni
        </Typography>
      </Card>
    )
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(assignment.issue.status)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info"
  })

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenStatusModal = () => {
    setSelectedStatus(assignment.issue.status)
    setShowStatusModal(true)
    handleMenuClose()
  }

  const handleChangeStatus = async () => {
    if (selectedStatus === assignment.issue.status) {
      setShowStatusModal(false)
      return
    }

    setUpdatingStatus(true)
    try {
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/issue-status?new_status=${encodeURIComponent(selectedStatus)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Greška pri promjeni statusa")
      }

      onStatusChange(assignment.id, selectedStatus)
      setShowStatusModal(false)
      setSnackbar({
        open: true,
        message: "Status je uspješno promijenjen!",
        severity: "success"
      })
    } catch (error) {
      console.error("Greška pri promjeni statusa:", error)
      setSnackbar({
        open: true,
        message: "Greška pri promjeni statusa",
        severity: "error"
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Primljeno":
        return "#2196f3"
      case "Dodijeljeno izvođaču":
        return "#2196f3"
      case "Na lokaciji":
        return "#ff9800"
      case "Popravka u toku":
        return "#f44336"
      case "Čeka dijelove":
        return "#ffc107"
      case "Završeno":
        return "#4caf50"
      case "Otkazano":
        return "#9e9e9e"
      default:
        return "#666"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Primljeno":
        return "PRIMLJENO"
      case "Dodijeljeno izvođaču":
        return "DODIJELJENO IZVOĐAČU"
      case "Na lokaciji":
        return "NA LOKACIJI"
      case "Popravka u toku":
        return "POPRAVKA U TOKU"
      case "Čeka dijelove":
        return "ČEKA DIJELOVE"
      case "Završeno":
        return "ZAVRŠENO"
      case "Otkazano":
        return "OTKAZANO"
      default:
        return status.toUpperCase()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const availableStatuses = [
    "Primljeno",
    "Dodijeljeno izvođaču",
    "Na lokaciji", 
    "Popravka u toku",
    "Čeka dijelove",
    "Završeno",
    "Otkazano"
  ].filter(status => status !== assignment.issue.status)

  const canChangeStatus = assignment.issue.status !== "Završeno"

  return (
    <>
      <Card
        sx={{
          bgcolor: "#2a2a2a",
          border: "1px solid #333",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: "#42a5f5",
            boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
          },
        }}
      >
        <CardContent>
          {/* Header with chips and menu */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={assignment.issue.category.name.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: "#42a5f5",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />
              <Chip
                label={getStatusText(assignment.issue.status)}
                size="small"
                sx={{
                  bgcolor: getStatusColor(assignment.issue.status),
                  color: "#fff",
                  fontWeight: "bold",
                }}
              />
            </Box>

            <IconButton size="small" onClick={handleMenuOpen} sx={{ color: "#b0b0b0" }}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Title and description */}
          <Typography variant="h6" sx={{ color: "#fff", mb: 1, fontWeight: "bold" }}>
            {assignment.issue.title}
          </Typography>
          {assignment.issue.description && (
            <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
              {assignment.issue.description}
            </Typography>
          )}

          {/* Tenant info */}
          {assignment.issue.tenant && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PersonIcon sx={{ color: "#666", fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {assignment.issue.tenant.full_name || "Nepoznato"}
              </Typography>
            </Box>
          )}

          {assignment.issue.tenant?.phone && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PhoneIcon sx={{ color: "#666", fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {assignment.issue.tenant.phone}
              </Typography>
            </Box>
          )}

          {assignment.issue.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LocationOnIcon sx={{ color: "#666", fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {assignment.issue.location}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CalendarTodayIcon sx={{ color: "#666", fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              Prijavljeno: {formatDate(assignment.issue.created_at)}
            </Typography>
          </Box>

          {/* Change Status Button */}
          {canChangeStatus && (
            <Button
              fullWidth
              variant="contained"
              onClick={handleOpenStatusModal}
              disabled={isChangingStatus}
              startIcon={isChangingStatus ? <CircularProgress size={16} /> : <SyncIcon />}
              sx={{
                background: "linear-gradient(45deg, #22c55e, #16a34a)",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(45deg, #16a34a, #15803d)",
                },
                "&:disabled": {
                  background: "#666",
                  color: "#999",
                },
              }}
            >
              Promjeni Status
            </Button>
          )}

          {/* Context Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: "#2a2a2a",
                border: "1px solid #333",
                "& .MuiMenuItem-root": {
                  color: "#fff",
                  "&:hover": { bgcolor: "#333" },
                },
              },
            }}
          >
            <MenuItem onClick={handleOpenStatusModal}>Promijeni status</MenuItem>
            <MenuItem onClick={handleMenuClose}>Prikaži detalje</MenuItem>
            <MenuItem onClick={handleMenuClose}>Kontaktiraj stanara</MenuItem>
          </Menu>
        </CardContent>
      </Card>

      {/* Status Change Modal */}
      <Dialog
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #444" }}>
          Promijeni status prijave
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
            Trenutni status: <strong style={{ color: "#fff" }}>{assignment.issue.status}</strong>
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#b0b0b0" }}>Novi status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{
                backgroundColor: "#1e1e1e",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#444",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "& .MuiSelect-select": {
                  color: "#fff",
                },
                "& .MuiSelect-icon": {
                  color: "#b0b0b0",
                },
              }}
            >
              <MenuItem value={assignment.issue.status} disabled>
                {assignment.issue.status} (trenutni)
              </MenuItem>
              {availableStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowStatusModal(false)}
            sx={{ color: "#b0b0b0" }}
          >
            Odustani
          </Button>
          <Button
            onClick={handleChangeStatus}
            disabled={updatingStatus || selectedStatus === assignment.issue.status}
            variant="contained"
            sx={{
              backgroundColor: "#42a5f5",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
              "&:disabled": {
                backgroundColor: "#666",
              },
            }}
          >
            {updatingStatus ? <CircularProgress size={20} /> : "Promijeni status"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}
