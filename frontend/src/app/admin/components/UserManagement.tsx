"use client"

import { useState, useEffect } from "react"
import { Paper, Typography, Box, Chip, Avatar, Divider, TextField, InputAdornment, CircularProgress, Alert } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import type { User } from "../types"
import { getUsers } from "../../../utils/adminApi"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers()
        setUsers(data)
      } catch (err) {
        setError('Greška pri učitavanju korisnika')
        console.error('Error loading users:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "administrator":
      case "admin":
        return "#ef4444"
      case "upravnik":
      case "manager":
        return "#f97316"
      case "izvođač":
      case "contractor":
        return "#10b981"
      case "stanar":
      case "tenant":
        return "#6366f1"
      default:
        return "#6b7280"
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
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold", mb: 2 }}>
          Upravljanje Korisnicima
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Pretraži korisnike..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#b0b0b0" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#1e1e1e",
              color: "#fff",
              "& fieldset": { borderColor: "#333" },
              "&:hover fieldset": { borderColor: "#42a5f5" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
          }}
        />
      </Box>

      <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
        {loading && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CircularProgress sx={{ color: "#42a5f5" }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0", mt: 1 }}>
              Učitavam korisnike...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Alert severity="error" sx={{ bgcolor: "#ef4444", color: "#fff" }}>
              {error}
            </Alert>
          </Box>
        )}

        {!loading && !error && filteredUsers.map((user, index) => (
          <Box key={user.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                "&:hover": { bgcolor: "#333" },
              }}
            >
              <Avatar sx={{ bgcolor: "#42a5f5", width: 40, height: 40 }}>
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: "bold" }}>
                  {user.full_name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                  {user.email}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, alignItems: "flex-end" }}>
                <Chip
                  label={user.role_name.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: getRoleColor(user.role_name),
                    color: "#fff",
                    fontSize: "0.7rem",
                  }}
                />
                <Chip
                  label="AKTIVAN"
                  size="small"
                  sx={{
                    bgcolor: "#10b981",
                    color: "#fff",
                    fontSize: "0.7rem",
                  }}
                />
              </Box>
            </Box>
            {index < filteredUsers.length - 1 && <Divider sx={{ bgcolor: "#333" }} />}
          </Box>
        ))}

        {!loading && !error && filteredUsers.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
              Nema korisnika koji odgovaraju pretrazi
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  )
}
