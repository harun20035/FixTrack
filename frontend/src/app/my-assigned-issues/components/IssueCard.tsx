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
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import SyncIcon from "@mui/icons-material/Sync"
import EventIcon from "@mui/icons-material/Event"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import NoteIcon from "@mui/icons-material/Note"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CancelIcon from "@mui/icons-material/Cancel"
import UploadIcon from "@mui/icons-material/Upload"
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

  // New states for planned date and cost
  const [showPlannedDataModal, setShowPlannedDataModal] = useState(false)
  const [showViewPlannedDataModal, setShowViewPlannedDataModal] = useState(false)
  const [plannedDate, setPlannedDate] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [updatingPlannedData, setUpdatingPlannedData] = useState(false)

  // New states for completion uploads
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewCompletionModal, setShowViewCompletionModal] = useState(false)
  const [completionNotes, setCompletionNotes] = useState("")
  const [completionFiles, setCompletionFiles] = useState<File[]>([])
  const [warrantyPdf, setWarrantyPdf] = useState<File | null>(null)
  const [uploadingCompletion, setUploadingCompletion] = useState(false)
  const [completionImages, setCompletionImages] = useState<any[]>([])
  const [completionDocuments, setCompletionDocuments] = useState<any[]>([])
  const [warrantyDocument, setWarrantyDocument] = useState<any>(null)

  // New states for cancellation
  const [showCancellationModal, setShowCancellationModal] = useState(false)
  const [showViewCancellationModal, setShowViewCancellationModal] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [updatingCancellation, setUpdatingCancellation] = useState(false)

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

    // If status is "Otkazano", show cancellation reason modal
    if (selectedStatus === "Otkazano") {
      setShowStatusModal(false)
      setShowCancellationModal(true)
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

  const handleConfirmCancellation = async () => {
    if (!cancellationReason.trim()) {
      setSnackbar({
        open: true,
        message: "Molimo unesite razlog otkazivanja",
        severity: "error"
      })
      return
    }

    setUpdatingStatus(true)
    try {
      // First update the cancellation reason
      await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/cancellation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancellation_reason: cancellationReason
        })
      })

      // Then update the status
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/issue-status?new_status=${encodeURIComponent("Otkazano")}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Greška pri promjeni statusa")
      }

      onStatusChange(assignment.id, "Otkazano")
      setShowCancellationModal(false)
      setCancellationReason("")
      setSnackbar({
        open: true,
        message: "Status je uspješno promijenjen na Otkazano!",
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

  // Planned date and cost functions
  const handleUpdatePlannedData = async () => {
    if (!plannedDate || !estimatedCost) {
      setSnackbar({
        open: true,
        message: "Molimo unesite planirani datum i procjenu troškova",
        severity: "error"
      })
      return
    }

    setUpdatingPlannedData(true)
    try {
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/planned-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planned_date: plannedDate,
          estimated_cost: parseFloat(estimatedCost)
        })
      })

      if (!response.ok) {
        throw new Error("Greška pri ažuriranju planiranih podataka")
      }

      setShowPlannedDataModal(false)
      setSnackbar({
        open: true,
        message: "Planirani podaci su uspješno ažurirani!",
        severity: "success"
      })
    } catch (error) {
      console.error("Greška pri ažuriranju planiranih podataka:", error)
      setSnackbar({
        open: true,
        message: "Greška pri ažuriranju planiranih podataka",
        severity: "error"
      })
    } finally {
      setUpdatingPlannedData(false)
    }
  }

  const handleViewPlannedData = async () => {
    try {
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/planned-data`)
      if (response.ok) {
        const result = await response.json()
        const data = result.data
        setPlannedDate(data.planned_date || "")
        setEstimatedCost(data.estimated_cost?.toString() || "")
        setShowViewPlannedDataModal(true)
      }
    } catch (error) {
      console.error("Greška pri dohvatanju planiranih podataka:", error)
    }
  }

  // Completion upload functions
  const handleUploadCompletion = async () => {
    if (!completionNotes.trim() && completionFiles.length === 0 && !warrantyPdf) {
      setSnackbar({
        open: true,
        message: "Molimo unesite bilješke, priložite slike ili PDF za garanciju",
        severity: "error"
      })
      return
    }

    if (completionFiles.length > 5) {
      setSnackbar({
        open: true,
        message: "Maksimalno 5 slika je dozvoljeno za upload",
        severity: "error"
      })
      return
    }

    setUploadingCompletion(true)
    try {
      const formData = new FormData()
      formData.append('notes', completionNotes)
      
      completionFiles.forEach((file, index) => {
        formData.append(`images`, file)
      })

      if (warrantyPdf) {
        formData.append('warranty_pdf', warrantyPdf)
      }

      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/completion`, {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error("Greška pri upload-u završnih podataka")
      }

      setShowUploadModal(false)
      setCompletionNotes("")
      setCompletionFiles([])
      setWarrantyPdf(null)
      setSnackbar({
        open: true,
        message: "Završni podaci su uspješno upload-ovani!",
        severity: "success"
      })
    } catch (error) {
      console.error("Greška pri upload-u završnih podataka:", error)
      setSnackbar({
        open: true,
        message: "Greška pri upload-u završnih podataka",
        severity: "error"
      })
    } finally {
      setUploadingCompletion(false)
    }
  }

  const handleViewCompletion = async () => {
    try {
      // Reset state first
      setCompletionNotes("")
      setCompletionImages([])
      setCompletionDocuments([])
      setWarrantyDocument(null)
      
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/completion`)
      if (response.ok) {
        const result = await response.json()
        const data = result.data
        
        setCompletionNotes(data.notes || "")
        setCompletionImages(data.images || [])
        setCompletionDocuments(data.documents || [])
        setWarrantyDocument(data.warranty_document || null)
        setShowViewCompletionModal(true)
      }
    } catch (error) {
      console.error("Greška pri dohvatanju završnih podataka:", error)
    }
  }

  // Cancellation functions
  const handleUpdateCancellation = async () => {
    if (!cancellationReason.trim()) {
      setSnackbar({
        open: true,
        message: "Molimo unesite razlog otkazivanja",
        severity: "error"
      })
      return
    }

    setUpdatingCancellation(true)
    try {
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/cancellation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancellation_reason: cancellationReason
        })
      })

      if (!response.ok) {
        throw new Error("Greška pri ažuriranju razloga otkazivanja")
      }

      setShowCancellationModal(false)
      setSnackbar({
        open: true,
        message: "Razlog otkazivanja je uspješno ažuriran!",
        severity: "success"
      })
    } catch (error) {
      console.error("Greška pri ažuriranju razloga otkazivanja:", error)
      setSnackbar({
        open: true,
        message: "Greška pri ažuriranju razloga otkazivanja",
        severity: "error"
      })
    } finally {
      setUpdatingCancellation(false)
    }
  }

  const handleViewCancellation = async () => {
    try {
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/cancellation`)
      if (response.ok) {
        const result = await response.json()
        const data = result.data
        setCancellationReason(data.cancellation_reason || "")
        setShowViewCancellationModal(true)
      }
    } catch (error) {
      console.error("Greška pri dohvatanju razloga otkazivanja:", error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      if (files.length > 5) {
        setSnackbar({
          open: true,
          message: "Maksimalno 5 slika je dozvoljeno. Odabrano je samo prvih 5 slika.",
          severity: "warning"
        })
        setCompletionFiles(files.slice(0, 5))
      } else {
        setCompletionFiles(files)
      }
    }
  }

  const handleWarrantyPdfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setWarrantyPdf(event.target.files[0])
    }
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
            {/* Status-based menu items */}
            {assignment.issue.status === "Dodijeljeno izvođaču" && (
              <>
                <MenuItem onClick={() => { setShowPlannedDataModal(true); handleMenuClose(); }}>
                  <EventIcon sx={{ mr: 1 }} />
                  Unesi planirani datum i troškove
                </MenuItem>
                <MenuItem onClick={() => { handleViewPlannedData(); handleMenuClose(); }}>
                  <VisibilityIcon sx={{ mr: 1 }} />
                  Pregledaj planirane podatke
                </MenuItem>
              </>
            )}
            
            {assignment.issue.status === "Završeno" && (
              <>
                <MenuItem onClick={() => { setShowUploadModal(true); handleMenuClose(); }}>
                  <UploadIcon sx={{ mr: 1 }} />
                  Upload završnih slika i bilješki
                </MenuItem>
                <MenuItem onClick={() => { handleViewCompletion(); handleMenuClose(); }}>
                  <VisibilityIcon sx={{ mr: 1 }} />
                  Pregledaj završne podatke
                </MenuItem>
              </>
            )}
            
            {assignment.issue.status === "Otkazano" && (
              <MenuItem onClick={() => { handleViewCancellation(); handleMenuClose(); }}>
                <CancelIcon sx={{ mr: 1 }} />
                Pregledaj razlog otkazivanja
              </MenuItem>
            )}
            
            {(assignment.issue.status === "Čeka dijelove" || assignment.issue.status === "Na lokaciji" || assignment.issue.status === "Popravka u toku") && (
              <MenuItem onClick={() => { handleMenuClose(); }}>
                <NoteIcon sx={{ mr: 1 }} />
                Status: {assignment.issue.status}
              </MenuItem>
            )}
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

      {/* Planned Data Modal */}
      <Dialog
        open={showPlannedDataModal}
        onClose={() => setShowPlannedDataModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>
          Unesi planirani datum i troškove
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {/* @ts-ignore */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                label="Planirani datum"
                type="date"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#1e1e1e",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                  "& .MuiInputLabel-root": { color: "#b0b0b0" },
                  "& .MuiInputBase-input": { color: "#fff" },
                }}
              />
            </Grid>
            {/* @ts-ignore */}
            <Grid item xs={12}>
              <TextField
                label="Procjena troškova (KM)"
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#1e1e1e",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                  "& .MuiInputLabel-root": { color: "#b0b0b0" },
                  "& .MuiInputBase-input": { color: "#fff" },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowPlannedDataModal(false)}
            sx={{ color: "#b0b0b0" }}
          >
            Odustani
          </Button>
          <Button
            onClick={handleUpdatePlannedData}
            disabled={updatingPlannedData}
            variant="contained"
            sx={{
              backgroundColor: "#42a5f5",
              "&:hover": { backgroundColor: "#1976d2" },
              "&:disabled": { backgroundColor: "#666" },
            }}
          >
            {updatingPlannedData ? <CircularProgress size={20} /> : "Sačuvaj"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Planned Data Modal */}
      <Dialog
        open={showViewPlannedDataModal}
        onClose={() => setShowViewPlannedDataModal(false)}
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
          Planirani podaci
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, mt: 3 }}>
            <EventIcon sx={{ color: "#42a5f5" }} />
            <Typography variant="body1" sx={{ color: "#fff" }}>
              Planirani datum: {plannedDate ? new Date(plannedDate).toLocaleDateString("hr-HR") : "Nije unesen"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AttachMoneyIcon sx={{ color: "#42a5f5" }} />
            <Typography variant="body1" sx={{ color: "#fff" }}>
              Procjena troškova: {estimatedCost ? `${estimatedCost} KM` : "Nije unesena"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowViewPlannedDataModal(false)}
            variant="contained"
            sx={{
              backgroundColor: "#42a5f5",
              "&:hover": { backgroundColor: "#1976d2" },
            }}
          >
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Completion Modal */}
      <Dialog
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #444" }}>
          Upload završnih slika i bilješki
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Bilješke o završenom radu"
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1e1e1e",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
              "& .MuiInputLabel-root": { color: "#b0b0b0" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="completion-upload"
          />
          <label htmlFor="completion-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCameraIcon />}
              sx={{
                borderColor: "#42a5f5",
                color: "#42a5f5",
                "&:hover": { borderColor: "#1976d2", backgroundColor: "rgba(66, 165, 245, 0.1)" },
              }}
            >
              Odaberi slike
            </Button>
          </label>
          {completionFiles.length > 0 && (
            <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 1 }}>
              Odabrano {completionFiles.length}/5 slika
            </Typography>
          )}
          
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleWarrantyPdfChange}
              style={{ display: "none" }}
              id="warranty-pdf-upload"
            />
            <label htmlFor="warranty-pdf-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<NoteIcon />}
                sx={{
                  borderColor: "#42a5f5",
                  color: "#42a5f5",
                  "&:hover": { borderColor: "#1976d2", backgroundColor: "rgba(66, 165, 245, 0.1)" },
                }}
              >
                Odaberi PDF za garanciju
              </Button>
            </label>
            {warrantyPdf && (
              <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 1 }}>
                Odabran: {warrantyPdf.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowUploadModal(false)}
            sx={{ color: "#b0b0b0" }}
          >
            Odustani
          </Button>
          <Button
            onClick={handleUploadCompletion}
            disabled={uploadingCompletion}
            variant="contained"
            sx={{
              backgroundColor: "#42a5f5",
              "&:hover": { backgroundColor: "#1976d2" },
              "&:disabled": { backgroundColor: "#666" },
            }}
          >
            {uploadingCompletion ? <CircularProgress size={20} /> : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Completion Modal */}
      <Dialog
        open={showViewCompletionModal}
        onClose={() => setShowViewCompletionModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#2a2a2a",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #444" }}>
          Završni podaci
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {completionNotes && (
            <Box sx={{ mb: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                Bilješke
              </Typography>
              <Typography variant="body1" sx={{ color: "#b0b0b0", lineHeight: 1.6 }}>
                {completionNotes}
              </Typography>
            </Box>
          )}
          {completionImages.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                Slike
              </Typography>
              {/* @ts-ignore */}
              <Grid container spacing={2}>
                {completionImages.map((image, index) => (
                  // @ts-ignore
                  <Grid item xs={6} md={4} key={index}>
                    <Box
                      component="img"
                      src={`http://localhost:8000${image.image_url}`}
                      alt={`Završna slika ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid #444",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {completionDocuments.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                Dokumenti
              </Typography>
              <List>
                {completionDocuments.map((doc, index) => (
                  <ListItem key={index} sx={{ border: "1px solid #444", borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <NoteIcon sx={{ color: "#42a5f5" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.document_type}
                      secondary={doc.document_url}
                      sx={{ "& .MuiListItemText-primary": { color: "#fff" } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {warrantyDocument && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                PDF za garanciju
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #444", borderRadius: 1 }}>
                <NoteIcon sx={{ color: "#42a5f5" }} />
                <Typography variant="body1" sx={{ color: "#fff" }}>
                  {warrantyDocument.filename || "Garancija.pdf"}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(`http://localhost:8000${warrantyDocument.file_url}`, '_blank')}
                  sx={{
                    borderColor: "#42a5f5",
                    color: "#42a5f5",
                    "&:hover": { borderColor: "#1976d2", backgroundColor: "rgba(66, 165, 245, 0.1)" },
                  }}
                >
                  Otvori PDF
                </Button>
              </Box>
            </Box>
          )}
          {!completionNotes && completionImages.length === 0 && completionDocuments.length === 0 && !warrantyDocument && (
            <Typography variant="body1" sx={{ color: "#b0b0b0", textAlign: "center", py: 4 }}>
              Nema uploadovanih završnih podataka
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowViewCompletionModal(false)}
            variant="contained"
            sx={{
              backgroundColor: "#42a5f5",
              "&:hover": { backgroundColor: "#1976d2" },
            }}
          >
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancellation Reason Modal */}
      <Dialog
        open={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
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
          Razlog otkazivanja
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Opišite razlog otkazivanja"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1e1e1e",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
              "& .MuiInputLabel-root": { color: "#b0b0b0" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowCancellationModal(false)}
            sx={{ color: "#b0b0b0" }}
          >
            Odustani
          </Button>
          <Button
            onClick={handleConfirmCancellation}
            disabled={updatingStatus}
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
              "&:disabled": { backgroundColor: "#666" },
            }}
          >
            {updatingStatus ? <CircularProgress size={20} /> : "Potvrdi otkazivanje"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Cancellation Modal */}
      <Dialog
        open={showViewCancellationModal}
        onClose={() => setShowViewCancellationModal(false)}
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
          Razlog otkazivanja
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mt: 3 }}>
            <CancelIcon sx={{ color: "#f44336", mt: 0.5 }} />
            <Typography variant="body1" sx={{ color: "#fff" }}>
              {cancellationReason || "Razlog otkazivanja nije unesen"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowViewCancellationModal(false)}
            variant="contained"
            sx={{
              backgroundColor: "#42a5f5",
              "&:hover": { backgroundColor: "#1976d2" },
            }}
          >
            Zatvori
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
