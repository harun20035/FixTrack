"use client"

import { useState, useEffect } from "react"
import { Paper, Typography, Box, Chip, Button, Avatar, Divider, CircularProgress, Alert, Snackbar } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import type { RoleRequest } from "../types"
import { getRoleRequests, updateRoleRequest } from "../../../utils/adminApi"

export default function RoleRequests() {
  const [requests, setRequests] = useState<RoleRequest[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Load role requests on component mount
  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true)
        const data = await getRoleRequests()
        setRequests(data)
      } catch (err) {
        setError('Greška pri učitavanju zahtjeva')
        console.error('Error loading role requests:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadRequests()
  }, [])

  const handleApprove = async (requestId: number) => {
    try {
      setLoadingId(requestId)
      await updateRoleRequest(requestId, 'approved')
      
      setRequests((prev) => prev.map((req) => 
        req.id === requestId ? { ...req, status: "approved" as const } : req
      ))
      setSuccess('Zahtjev je uspješno odobren')
    } catch (err) {
      setError('Greška pri odobravanju zahtjeva')
      console.error('Error approving request:', err)
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (requestId: number) => {
    try {
      setLoadingId(requestId)
      await updateRoleRequest(requestId, 'rejected')
      
      setRequests((prev) => prev.map((req) => 
        req.id === requestId ? { ...req, status: "rejected" as const } : req
      ))
      setSuccess('Zahtjev je uspješno odbijen')
    } catch (err) {
      setError('Greška pri odbijanju zahtjeva')
      console.error('Error rejecting request:', err)
    } finally {
      setLoadingId(null)
    }
  }

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const processedRequests = requests.filter((req) => req.status !== "pending")

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "upravnik":
      case "manager":
        return "#f97316"
      case "izvođač":
      case "contractor":
        return "#10b981"
      case "stanar":
      case "tenant":
        return "#6366f1"
      case "administrator":
      case "admin":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#10b981"
      case "rejected":
        return "#ef4444"
      default:
        return "#f59e0b"
    }
  }

  return (
    <Paper
      sx={{
        bgcolor: "#2a2a2a",
        border: "1px solid #333",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 3, borderBottom: "1px solid #333" }}>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
          Zahtjevi za Promjenu Role
        </Typography>
        <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 0.5 }}>
          Prihvati ili odbij zahtjeve korisnika za promjenu role
        </Typography>
      </Box>

      <Box sx={{ maxHeight: "600px", overflowY: "auto" }}>
        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ color: "#f59e0b", mb: 2, fontWeight: "bold" }}>
              Na Čekanju ({pendingRequests.length})
            </Typography>

            {pendingRequests.map((request, index) => (
              <Box key={request.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 2,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#333" },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#42a5f5", width: 48, height: 48 }}>
                    {request.user_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: "bold" }}>
                        {request.user_name}
                      </Typography>
                      <PersonIcon sx={{ color: "#b0b0b0", fontSize: 16 }} />
                    </Box>

                    <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 1 }}>
                      {request.user_email}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Chip
                        label={request.current_role_name.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: getRoleColor(request.current_role_name),
                          color: "#fff",
                          fontSize: "0.75rem",
                        }}
                      />
                      <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                        →
                      </Typography>
                      <Chip
                        label={request.requested_role_name.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: getRoleColor(request.requested_role_name),
                          color: "#fff",
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: "#e0e0e0", mb: 2 }}>
                      {request.motivation}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                      Datum zahtjeva: {new Date(request.created_at).toLocaleDateString("bs-BA")}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={loadingId === request.id ? <CircularProgress size={16} /> : <CheckIcon />}
                      onClick={() => handleApprove(request.id)}
                      disabled={loadingId === request.id}
                      sx={{
                        bgcolor: "#10b981",
                        "&:hover": { bgcolor: "#059669" },
                        minWidth: 100,
                      }}
                    >
                      {loadingId === request.id ? "Odobravam..." : "Odobri"}
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={loadingId === request.id ? <CircularProgress size={16} /> : <CloseIcon />}
                      onClick={() => handleReject(request.id)}
                      disabled={loadingId === request.id}
                      sx={{
                        bgcolor: "#ef4444",
                        "&:hover": { bgcolor: "#dc2626" },
                        minWidth: 100,
                      }}
                    >
                      {loadingId === request.id ? "Odbijam..." : "Odbij"}
                    </Button>
                  </Box>
                </Box>
                {index < pendingRequests.length - 1 && <Divider sx={{ bgcolor: "#333" }} />}
              </Box>
            ))}
          </Box>
        )}

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <Box sx={{ p: 3, borderTop: pendingRequests.length > 0 ? "1px solid #333" : "none" }}>
            <Typography variant="subtitle1" sx={{ color: "#b0b0b0", mb: 2, fontWeight: "bold" }}>
              Obrađeno ({processedRequests.length})
            </Typography>

            {processedRequests.map((request, index) => (
              <Box key={request.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 1,
                    opacity: 0.7,
                  }}
                >
                  <Avatar sx={{ bgcolor: "#666", width: 40, height: 40 }}>
                    {request.user_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                      {request.user_name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                      {request.current_role_name} → {request.requested_role_name}
                    </Typography>
                  </Box>

                  <Chip
                    label={request.status === "approved" ? "ODOBRENO" : "ODBIJENO"}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(request.status),
                      color: "#fff",
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
                {index < processedRequests.length - 1 && <Divider sx={{ bgcolor: "#333" }} />}
              </Box>
            ))}
          </Box>
        )}

        {loading && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress sx={{ color: "#42a5f5" }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 2 }}>
              Učitavam zahtjeve...
            </Typography>
          </Box>
        )}

        {!loading && requests.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Alert severity="info" sx={{ bgcolor: "#1e3a8a", color: "#fff" }}>
              Nema zahtjeva za promjenu role
            </Alert>
          </Box>
        )}
      </Box>

      {/* Error and Success Messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ bgcolor: "#ef4444", color: "#fff" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccess(null)}
          sx={{ bgcolor: "#10b981", color: "#fff" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
