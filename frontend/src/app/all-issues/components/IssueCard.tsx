"use client"
import Box from "@mui/material/Box"
import type React from "react"

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
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { useState, useEffect, Fragment } from "react"
import type { Issue } from "../types"
import { authFetch } from "@/utils/authFetch"

interface IssueCardProps {
  issue: Issue
  isAssigning: boolean
}

export default function IssueCard({ issue, isAssigning }: IssueCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [contractorDialogOpen, setContractorDialogOpen] = useState(false)
  const [contractors, setContractors] = useState<any[]>([])
  const [loadingContractors, setLoadingContractors] = useState(false)
  const [assigningToContractor, setAssigningToContractor] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAssignClick = async () => {
    setContractorDialogOpen(true)
    await loadContractors()
  }

  const loadContractors = async () => {
    setLoadingContractors(true)
    setError(null)
    try {
      const response = await authFetch("http://localhost:8000/api/manager/contractors")
      if (response.ok) {
        const data = await response.json()
        setContractors(data)
      } else {
        setError("Greška pri dohvaćanju izvođača")
      }
    } catch (error) {
      setError("Greška pri dohvaćanju izvođača")
      console.error("Error loading contractors:", error)
    } finally {
      setLoadingContractors(false)
    }
  }

  const handleAssignToContractor = async (contractorId: number) => {
    setAssigningToContractor(true)
    try {
      const response = await authFetch(`http://localhost:8000/api/manager/issues/${issue.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractor_id: contractorId })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Pronađi ime izvođača za notifikaciju
        const contractor = contractors.find(c => c.id === contractorId)
        const contractorName = contractor ? contractor.full_name : "izvođaču"
        
        // Prikaži uspješnu notifikaciju
        setSuccessMessage(`Izvođač ${contractorName} je uspješno dodijeljen zadatku!`)
        
        // Zatvori modal i resetuj stanje
        setContractorDialogOpen(false)
        setError(null)
        
        // Refresh stranice nakon 2 sekunde
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setError("Greška pri dodjeljivanju izvođača")
      }
    } catch (error) {
      setError("Greška pri dodjeljivanju izvođača")
      console.error("Error assigning contractor:", error)
    } finally {
      setAssigningToContractor(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "visok":
        return "#f44336"
      case "srednji":
        return "#ff9800"
      case "nizak":
        return "#4caf50"
      default:
        return "#666"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "voda":
        return "#2196f3"
      case "struja":
        return "#ff9800"
      case "grijanje":
        return "#f44336"
      case "ostalo":
        return "#9c27b0"
      default:
        return "#666"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Fragment>
      <Card
        sx={{
          backgroundColor: "#2a2a2a",
          border: "1px solid #444",
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "#42a5f5",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(66, 165, 245, 0.15)",
          },
        }}
      >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                fontWeight: 600,
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              {issue.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip
                label={issue.priority.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: getPriorityColor(issue.priority),
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                label={issue.category.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: getCategoryColor(issue.category),
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                label="PRIMLJENO"
                size="small"
                sx={{
                  backgroundColor: "#666",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
          </Box>
          <IconButton onClick={handleMenuOpen} sx={{ color: "#b0b0b0" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "#b0b0b0",
            mb: 3,
            lineHeight: 1.5,
          }}
        >
          {issue.description}
        </Typography>

        {/* Details */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PersonIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>
              {issue.tenant.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#b0b0b0", ml: 1 }}>
              - {issue.tenant.apartment}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {issue.tenant.phone}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {issue.location}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarTodayIcon sx={{ color: "#42a5f5", fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              {formatDate(issue.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#444", mb: 3 }} />

        {/* Action Button */}
        <Button
          fullWidth
          variant="contained"
          startIcon={isAssigning ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <AssignmentIndIcon />}
          onClick={handleAssignClick}
          disabled={isAssigning}
          sx={{
            background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
            color: "#fff",
            fontWeight: 600,
            py: 1.5,
            "&:hover": {
              background: "linear-gradient(45deg, #1976d2 30%, #1565c0 90%)",
            },
            "&:disabled": {
              background: "#666",
              color: "#999",
            },
          }}
        >
          {isAssigning ? "Dodjeljivanje..." : "Dodijeli Izvođača"}
        </Button>

        {/* Context Menu */}
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
          <MenuItem onClick={handleMenuClose}>Prikaži detalje</MenuItem>
          <MenuItem onClick={handleMenuClose}>Dodaj napomenu</MenuItem>
          <MenuItem onClick={handleMenuClose}>Kontaktiraj stanara</MenuItem>
          <Divider sx={{ borderColor: "#444" }} />
          <MenuItem onClick={handleMenuClose} sx={{ color: "#f44336 !important" }}>
            Odbaci prijavu
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>

    {/* Contractor Selection Dialog */}
    <Dialog 
      open={contractorDialogOpen} 
      onClose={() => setContractorDialogOpen(false)}
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#2a2a2a",
          color: "#fff",
          border: "1px solid #444"
        }
      }}
    >
      <DialogTitle>Odaberi Izvođača</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: "#d32f2f", color: "#fff" }}>
            {error}
          </Alert>
        )}
        
        {loadingContractors ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : contractors.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", p: 3 }}>
            Nema dostupnih izvođača
          </Typography>
        ) : (
          <List>
            {contractors.map((contractor) => (
              <ListItem 
                key={contractor.id}
                sx={{
                  border: "1px solid #444",
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": {
                    borderColor: "#42a5f5",
                    backgroundColor: "rgba(66, 165, 245, 0.1)"
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: contractor.is_available ? "#22c55e" : "#ef4444" }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle1" color="#fff">
                        {contractor.full_name}
                      </Typography>
                      <Chip
                        label={contractor.is_available ? "Slobodan" : "Zauzet"}
                        size="small"
                        sx={{
                          backgroundColor: contractor.is_available ? "#22c55e" : "#ef4444",
                          color: "#fff",
                          fontSize: "0.7rem"
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="#b0b0b0">
                        {contractor.email} • {contractor.phone}
                      </Typography>
                      <Typography variant="body2" color="#b0b0b0">
                        Aktivni zadaci: {contractor.active_assignments_count || 0}
                      </Typography>
                    </Box>
                  }
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAssignToContractor(contractor.id)}
                  disabled={!contractor.is_available || assigningToContractor}
                  startIcon={assigningToContractor ? <CircularProgress size={16} /> : <AssignmentIndIcon />}
                  sx={{
                    backgroundColor: contractor.is_available ? "#42a5f5" : "#666",
                    "&:hover": {
                      backgroundColor: contractor.is_available ? "#1976d2" : "#666"
                    }
                  }}
                >
                  {assigningToContractor ? "Dodjeljivanje..." : "Odaberi"}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setContractorDialogOpen(false)}
          sx={{ color: "#b0b0b0" }}
        >
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>

    {/* Success Snackbar */}
    <Snackbar
      open={!!successMessage}
      autoHideDuration={3000}
      onClose={() => setSuccessMessage(null)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert 
        onClose={() => setSuccessMessage(null)} 
        severity="success" 
        sx={{ 
          width: "100%",
          backgroundColor: "#22c55e",
          color: "#fff",
          "& .MuiAlert-icon": {
            color: "#fff"
          }
        }}
      >
        {successMessage}
      </Alert>
    </Snackbar>
    </Fragment>
  )
}
