"use client"

import { useState } from "react"
import { Card, CardContent, Typography, Box, Button, Avatar, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import { authFetch } from "@/utils/authFetch"
import type { Tenant } from "../types"

interface TenantCardProps {
  tenant: Tenant
}

export default function TenantCard({ tenant }: TenantCardProps) {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [sendingNote, setSendingNote] = useState(false)

  const handleAddNote = () => {
    setShowNoteModal(true)
  }

  const handleSendNote = async () => {
    if (!noteText.trim()) {
      alert("Molimo unesite napomenu")
      return
    }

    setSendingNote(true)
    try {
      const response = await authFetch("http://localhost:8000/api/manager/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenant_id: tenant.id,
          note: noteText.trim()
        }),
      })

      if (!response.ok) {
        throw new Error("Greška pri slanju napomene")
      }

      setShowNoteModal(false)
      setNoteText("")
      alert("Napomena je uspješno poslana!")
    } catch (error) {
      console.error("Greška pri slanju napomene:", error)
      alert("Greška pri slanju napomene")
    } finally {
      setSendingNote(false)
    }
  }

  const handleCloseModal = () => {
    setShowNoteModal(false)
    setNoteText("")
  }

  const getInitials = (fullName: string) => {
    const names = fullName.split(" ")
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`
    }
    return fullName.charAt(0).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#2a2a2a",
          border: "1px solid #333",
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: "#42a5f5",
            boxShadow: "0 8px 25px rgba(66, 165, 245, 0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header with Avatar and Name */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#42a5f5",
                width: 50,
                height: 50,
                mr: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {getInitials(tenant.full_name)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                {tenant.full_name}
              </Typography>
              <Chip
                label="AKTIVAN"
                size="small"
                sx={{
                  bgcolor: "#4caf50",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              />
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon sx={{ color: "#b0b0b0", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {tenant.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PhoneIcon sx={{ color: "#b0b0b0", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {tenant.phone}
              </Typography>
            </Box>
          </Box>

          {/* Address Info */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOnIcon sx={{ color: "#b0b0b0", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                {tenant.address}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarTodayIcon sx={{ color: "#b0b0b0", fontSize: 18, mr: 1 }} />
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Registrovan: {formatDate(tenant.created_at)}
              </Typography>
            </Box>
          </Box>

          {/* Add Note Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddNote}
            disabled={isAddingNote}
            sx={{
              background: "linear-gradient(45deg, #4caf50, #66bb6a)",
              color: "#fff",
              fontWeight: "bold",
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(45deg, #45a049, #5cb85c)",
              },
              "&:disabled": {
                background: "#666",
                color: "#999",
              },
            }}
          >
            {isAddingNote ? (
              <>
                <CircularProgress size={20} sx={{ color: "#fff", mr: 1 }} />
                Dodavanje napomene...
              </>
            ) : (
              "Dodaj Napomenu"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Note Modal */}
      <Dialog
        open={showNoteModal}
        onClose={handleCloseModal}
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
          Dodaj napomenu za {tenant.full_name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Unesite napomenu..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
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
                "& textarea": {
                  color: "#fff",
                },
                "& textarea::placeholder": {
                  color: "#b0b0b0",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #444" }}>
          <Button
            onClick={handleCloseModal}
            sx={{ color: "#b0b0b0" }}
          >
            Odustani
          </Button>
          <Button
            onClick={handleSendNote}
            disabled={sendingNote || !noteText.trim()}
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
            {sendingNote ? <CircularProgress size={20} /> : "Pošalji napomenu"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
