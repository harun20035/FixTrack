"use client"
import { useState } from "react"
import type React from "react"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import { styled } from "@mui/material/styles"
import SyncIcon from "@mui/icons-material/Sync"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PersonIcon from "@mui/icons-material/Person"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import UploadIcon from "@mui/icons-material/Upload"
import DescriptionIcon from "@mui/icons-material/Description"
import type { Assignment, StatusChangeRequest, RejectionRequest, CostUpdateRequest } from "../types"
import { authFetch } from "@/utils/authFetch"

const IssueCardStyled = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  borderRadius: 12,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
    transform: "translateY(-2px)",
  },
}))

interface ContractorIssueCardProps {
  assignment: Assignment
  onStatusChange: (assignmentId: number, newStatus: string) => void
}

export default function ContractorIssueCard({ assignment, onStatusChange }: ContractorIssueCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [costDialogOpen, setCostDialogOpen] = useState(false)
  const [statusChangeData, setStatusChangeData] = useState<StatusChangeRequest>({ status: "", notes: "" })
  const [rejectionData, setRejectionData] = useState<RejectionRequest>({ rejection_reason: "" })
  const [costData, setCostData] = useState<CostUpdateRequest>({ actual_cost: 0 })

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleStatusChange = async () => {
    if (!statusChangeData.status) return
    
    setIsChangingStatus(true)
    try {
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusChangeData)
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          onStatusChange(assignment.id, statusChangeData.status)
          setStatusDialogOpen(false)
          setStatusChangeData({ status: "", notes: "" })
        }
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsChangingStatus(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionData.rejection_reason) return
    
    try {
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rejectionData)
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          onStatusChange(assignment.id, "Odbijeno")
          setRejectDialogOpen(false)
          setRejectionData({ rejection_reason: "" })
        }
      }
    } catch (error) {
      console.error("Error rejecting assignment:", error)
    }
  }

  const handleCostUpdate = async () => {
    if (costData.actual_cost <= 0) return
    
    try {
      const formData = new FormData()
      formData.append("actual_cost", costData.actual_cost.toString())
      
      const response = await authFetch(`http://localhost:8000/api/contractor/assignments/${assignment.id}/cost`, {
        method: "PUT",
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCostDialogOpen(false)
          setCostData({ actual_cost: 0 })
          // Refresh the assignment data
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Error updating cost:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dodijeljeno":
        return "#8B5CF6"
      case "U toku":
        return "#3B82F6"
      case "Čeka dijelove":
        return "#F59E0B"
      case "Završeno":
        return "#22C55E"
      case "Odbijeno":
        return "#EF4444"
      default:
        return "#42a5f5"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Voda":
        return "#3B82F6"
      case "Struja":
        return "#F97316"
      case "Grijanje":
        return "#EF4444"
      case "Ostalo":
        return "#8B5CF6"
      default:
        return "#42a5f5"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canChangeStatus = assignment.status !== "Završeno" && assignment.status !== "Odbijeno"
  const canReject = assignment.status !== "Završeno" && assignment.status !== "Odbijeno"
  const canUpdateCost = assignment.status === "Završeno"

  return (
    <>
      <IssueCardStyled>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                {assignment.issue.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Chip
                  label={assignment.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(assignment.status),
                    color: "white",
                    fontWeight: 500,
                  }}
                />
                {assignment.issue.category && (
                  <Chip
                    label={assignment.issue.category.name}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryColor(assignment.issue.category.name),
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                )}
              </Box>
            </Box>
            <IconButton onClick={handleMenuOpen} sx={{ color: "text.secondary" }}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Description */}
          {assignment.issue.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              {assignment.issue.description}
            </Typography>
          )}

          {/* Tenant Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                {assignment.tenant.full_name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                {assignment.tenant.phone}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                {assignment.tenant.email}
              </Typography>
            </Box>
          </Box>

          {/* Details */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
            {assignment.issue.location && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  {assignment.issue.location}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                Prijavljeno: {formatDate(assignment.issue.created_at)}
              </Typography>
            </Box>
            {assignment.actual_cost && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AttachMoneyIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
                <Typography variant="body2" color="text.secondary">
                  Troškovi: {assignment.actual_cost} KM
                </Typography>
              </Box>
            )}
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Ažurirano: {formatDate(assignment.updated_at)}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {canChangeStatus && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={isChangingStatus ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />}
                  onClick={() => setStatusDialogOpen(true)}
                  disabled={isChangingStatus}
                  sx={{
                    background: "linear-gradient(45deg, #22C55E 30%, #16A34A 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #16A34A 30%, #22C55E 90%)",
                    },
                    "&:disabled": {
                      background: "#666",
                      color: "#999",
                    },
                  }}
                >
                  {isChangingStatus ? "Mijenjanje statusa..." : "Promjeni Status"}
                </Button>
              )}
              {canUpdateCost && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AttachMoneyIcon />}
                  onClick={() => setCostDialogOpen(true)}
                  sx={{ color: "#42a5f5", borderColor: "#42a5f5" }}
                >
                  Troškovi
                </Button>
              )}
            </Box>
          </Box>

          {/* Context Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { setStatusDialogOpen(true); handleMenuClose(); }}>
              Promjeni status
            </MenuItem>
            {canReject && (
              <MenuItem onClick={() => { setRejectDialogOpen(true); handleMenuClose(); }}>
                Odbij prijavu
              </MenuItem>
            )}
            <MenuItem onClick={handleMenuClose}>Dodaj napomenu</MenuItem>
            <MenuItem onClick={handleMenuClose}>Kontaktiraj stanara</MenuItem>
            <MenuItem onClick={handleMenuClose}>Priloži sliku</MenuItem>
            {assignment.status === "Završeno" && (
              <MenuItem onClick={handleMenuClose}>Učitaj dokumente</MenuItem>
            )}
          </Menu>
        </CardContent>
      </IssueCardStyled>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Promjeni Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Novi Status</InputLabel>
            <Select
              value={statusChangeData.status}
              onChange={(e) => setStatusChangeData({ ...statusChangeData, status: e.target.value })}
              label="Novi Status"
            >
              <MenuItem value="Dodijeljeno">Dodijeljeno</MenuItem>
              <MenuItem value="U toku">U toku</MenuItem>
              <MenuItem value="Čeka dijelove">Čeka dijelove</MenuItem>
              <MenuItem value="Završeno">Završeno</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Napomene (opciono)"
            value={statusChangeData.notes}
            onChange={(e) => setStatusChangeData({ ...statusChangeData, notes: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Otkaži</Button>
          <Button 
            onClick={handleStatusChange} 
            variant="contained" 
            disabled={!statusChangeData.status || isChangingStatus}
          >
            {isChangingStatus ? "Mijenjanje..." : "Promjeni"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Odbij Prijavu</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Razlog odbijanja"
            value={rejectionData.rejection_reason}
            onChange={(e) => setRejectionData({ rejection_reason: e.target.value })}
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Otkaži</Button>
          <Button 
            onClick={handleReject} 
            variant="contained" 
            color="error"
            disabled={!rejectionData.rejection_reason}
          >
            Odbij
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cost Update Dialog */}
      <Dialog open={costDialogOpen} onClose={() => setCostDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ažuriraj Troškove</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="Stvarni troškovi (KM)"
            value={costData.actual_cost}
            onChange={(e) => setCostData({ actual_cost: parseFloat(e.target.value) || 0 })}
            sx={{ mt: 2 }}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCostDialogOpen(false)}>Otkaži</Button>
          <Button 
            onClick={handleCostUpdate} 
            variant="contained"
            disabled={costData.actual_cost <= 0}
          >
            Ažuriraj
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
