"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import PersonIcon from "@mui/icons-material/Person"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import SyncIcon from "@mui/icons-material/Sync"
import DescriptionIcon from "@mui/icons-material/Description"
import { authFetch } from "@/utils/authFetch"
import type { Issue } from "../types"

interface IssueCardProps {
  issue: Issue
  onStatusChange: (updatedIssue: Issue) => void
}

export function IssueCard({ issue, onStatusChange }: IssueCardProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(issue.status)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notes, setNotes] = useState<any[]>([])
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info"
  })

  const handleChangeStatus = async () => {
    if (selectedStatus === issue.status) {
      setShowStatusModal(false)
      return
    }

    setUpdatingStatus(true)
    try {
      const response = await authFetch(`http://localhost:8000/api/manager/issues/${issue.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedStatus),
      })

      if (!response.ok) {
        throw new Error("Greška pri promjeni statusa")
      }

      const updatedIssue = { ...issue, status: selectedStatus }
      onStatusChange(updatedIssue)
      setShowStatusModal(false)
    } catch (error) {
      console.error("Greška pri promjeni statusa:", error)
      alert("Greška pri promjeni statusa")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const fetchNotes = async () => {
    try {
      const response = await authFetch(`http://localhost:8000/api/manager/issues/${issue.id}/notes`)
      if (!response.ok) {
        throw new Error("Greška pri dohvatanju napomena")
      }
      const adminNotes = await response.json()
      setNotes(adminNotes)
    } catch (error) {
      console.error("Greška pri dohvatanju napomena:", error)
      setSnackbar({
        open: true,
        message: "Greška pri dohvatanju napomena",
        severity: "error"
      })
    }
  }

  const handleViewNotes = async () => {
    handleMenuClose() // Zatvori menu prvo
    setLoadingNotes(true)
    setShowNotesModal(true)
    await fetchNotes()
    setLoadingNotes(false)
  }

  const fetchComments = async () => {
    try {
      const response = await authFetch(`http://localhost:8000/api/issues/${issue.id}/comments`)
      if (!response.ok) {
        throw new Error("Greška pri dohvatanju komentara")
      }
      const userComments = await response.json()
      setComments(userComments)
    } catch (error) {
      console.error("Greška pri dohvatanju komentara:", error)
      setSnackbar({
        open: true,
        message: "Greška pri dohvatanju komentara",
        severity: "error"
      })
    }
  }

  const handleViewComments = async () => {
    handleMenuClose() // Zatvori menu prvo
    setLoadingComments(true)
    setShowCommentsModal(true)
    await fetchComments()
    setLoadingComments(false)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleOpenStatusModal = () => {
    setSelectedStatus(issue.status)
    setShowStatusModal(true)
    handleMenuClose()
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) return
    
    setAddingNote(true)
    try {
      const response = await authFetch(`http://localhost:8000/api/manager/issues/${issue.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: noteText.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Greška pri dodavanju napomene")
      }

      setShowNoteModal(false)
      setNoteText("")
      setSnackbar({
        open: true,
        message: "Napomena je uspješno dodana!",
        severity: "success"
      })
      
      // Osveži napomene ako je modal za napomene otvoren
      if (showNotesModal) {
        await fetchNotes()
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Greška pri dodavanju napomene: " + (error instanceof Error ? error.message : "Nepoznata greška"),
        severity: "error"
      })
    } finally {
      setAddingNote(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  // Zatvori snackbar kada se issue promeni
  useEffect(() => {
    handleCloseSnackbar()
  }, [issue.id])

  const getStatusColor = (status: string) => {
    switch (status) {
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
    "Dodijeljeno izvođaču",
    "Na lokaciji", 
    "Popravka u toku",
    "Čeka dijelove",
    "Završeno",
    "Otkazano"
  ].filter(status => status !== issue.status)

  return (
    <>
    <Card
      sx={{
        backgroundColor: "#2a2a2a",
        border: "1px solid #444",
        borderRadius: 2,
        "&:hover": {
          borderColor: "#42a5f5",
            boxShadow: "0 4px 8px rgba(66, 165, 245, 0.2)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
              {issue.title}
            </Typography>
          <Chip
            label={getStatusText(issue.status)}
            size="small"
            sx={{
              backgroundColor: getStatusColor(issue.status),
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: "#b0b0b0",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                  color: "#42a5f5",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Description */}
          {issue.description && (
            <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 3 }}>
              {issue.description}
            </Typography>
          )}

          {/* Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
            {issue.location && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ color: "#42a5f5", fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {issue.location}
            </Typography>
          </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ color: "#42a5f5", fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Prijavljeno: {formatDate(issue.created_at)}
              </Typography>
            </Box>

            {issue.tenant && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon sx={{ color: "#42a5f5", fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  {issue.tenant.full_name}
                </Typography>
                {issue.tenant.phone && (
                  <>
                    <PhoneIcon sx={{ color: "#42a5f5", fontSize: 16, ml: 1 }} />
                    <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                      {issue.tenant.phone}
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {issue.category && (
              <Chip
                label={issue.category.name}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "#42a5f5",
                  color: "#42a5f5",
                  alignSelf: "flex-start",
                }}
              />
          )}
        </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={isChangingStatus ? <CircularProgress size={16} /> : <SyncIcon />}
              onClick={handleOpenStatusModal}
              disabled={isChangingStatus}
              sx={{
                borderColor: "#42a5f5",
                color: "#42a5f5",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                  borderColor: "#1976d2",
                },
              }}
            >
              Promijeni status
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowNoteModal(true)}
              startIcon={<DescriptionIcon />}
              sx={{
                borderColor: "#22c55e",
                color: "#22c55e",
                "&:hover": {
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  borderColor: "#16a34a",
                },
              }}
            >
              Dodaj napomenu
            </Button>
          </Box>
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
            Trenutni status: <strong style={{ color: "#fff" }}>{issue.status}</strong>
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
              <MenuItem value={issue.status} disabled>
                {issue.status} (trenutni)
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
            disabled={updatingStatus || selectedStatus === issue.status}
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

      {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              "& .MuiMenuItem-root": {
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(66, 165, 245, 0.1)",
                },
              },
            },
          }}
        >
        <MenuItem onClick={handleViewNotes}>
          Pogledaj napomene
        </MenuItem>
        <MenuItem onClick={handleViewComments}>
          Pogledaj komentare
        </MenuItem>
        </Menu>

      {/* Note Modal */}
      <Dialog
        open={showNoteModal}
        onClose={() => setShowNoteModal(false)}
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
          Dodaj napomenu
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 2 }}>
            Dodaj napomenu za prijavu: <strong style={{ color: "#fff" }}>{issue.title}</strong>
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Unesite napomenu..."
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1e1e1e",
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#42a5f5",
                },
                "& .MuiInputBase-input": {
                  color: "#fff",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#666",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => setShowNoteModal(false)}
            sx={{ color: "#b0b0b0" }}
          >
            Odustani
          </Button>
          <Button
            onClick={handleAddNote}
            disabled={addingNote || !noteText.trim()}
            variant="contained"
            sx={{
              backgroundColor: "#22c55e",
              "&:hover": {
                backgroundColor: "#16a34a",
              },
              "&:disabled": {
                backgroundColor: "#666",
              },
            }}
          >
            {addingNote ? <CircularProgress size={20} /> : "Dodaj napomenu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notes Modal */}
      <Dialog
        open={showNotesModal}
        onClose={() => {
          setShowNotesModal(false)
          handleCloseSnackbar() // Zatvori snackbar kada se zatvori modal
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#2a2a2a",
            color: "#fff",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #444" }}>
          Komentari za: {issue.title}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loadingNotes ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : notes.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#b0b0b0", textAlign: "center", py: 4 }}>
              Nema komentara za ovaj issue.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {notes.map((note, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: "#1a1a1a",
                    borderRadius: 2,
                    border: "1px solid #444",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: "#42a5f5", fontWeight: 600 }}>
                      {note.admin?.full_name || "Nepoznato"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                      {new Date(note.created_at).toLocaleString("bs-BA")}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    {note.note}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => {
              setShowNotesModal(false)
              handleCloseSnackbar() // Zatvori snackbar kada se zatvori modal
            }}
            sx={{
              color: "#b0b0b0",
              "&:hover": {
                backgroundColor: "rgba(66, 165, 245, 0.1)",
              },
            }}
          >
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comments Modal */}
      <Dialog
        open={showCommentsModal}
        onClose={() => {
          setShowCommentsModal(false)
          handleCloseSnackbar() // Zatvori snackbar kada se zatvori modal
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#2a2a2a",
            color: "#fff",
            border: "1px solid #444",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #444" }}>
          Komentari korisnika za: {issue.title}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loadingComments ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : comments.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#b0b0b0", textAlign: "center", py: 4 }}>
              Nema komentara od korisnika za ovaj issue.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {comments.map((comment, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    backgroundColor: "#1a1a1a",
                    borderRadius: 2,
                    border: "1px solid #444",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: "#42a5f5", fontWeight: 600 }}>
                      {comment.user?.full_name || "Nepoznato"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                      {new Date(comment.created_at).toLocaleString("bs-BA")}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    {comment.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #444" }}>
          <Button
            onClick={() => {
              setShowCommentsModal(false)
              handleCloseSnackbar() // Zatvori snackbar kada se zatvori modal
            }}
            sx={{
              color: "#b0b0b0",
              "&:hover": {
                backgroundColor: "rgba(66, 165, 245, 0.1)",
              },
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
