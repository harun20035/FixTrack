"use client"

import { useState, useEffect } from "react"
import { Paper, Typography, Box, Switch, FormControlLabel, Button, Divider, Alert, CircularProgress } from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import SaveIcon from "@mui/icons-material/Save"
import type { SystemSettings } from "../types"
import { getSystemSettings, updateSystemSettings } from "../../../utils/adminApi"

export default function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        const data = await getSystemSettings()
        setSettings(data)
      } catch (err) {
        setError('Greška pri učitavanju postavki')
        console.error('Error loading settings:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadSettings()
  }, [])

  const handleSettingChange = (setting: keyof SystemSettings) => {
    if (!settings) return
    
    setSettings((prev) => ({
      ...prev!,
      [setting]: !prev![setting],
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!settings) return
    
    try {
      setSaving(true)
      await updateSystemSettings({
        allow_registration: settings.allow_registration,
        require_approval: settings.require_approval,
        email_notifications: settings.email_notifications,
        maintenance_mode: settings.maintenance_mode,
        auto_assignment: settings.auto_assignment,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Greška pri čuvanju postavki')
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <SettingsIcon sx={{ color: "#42a5f5" }} />
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
            Sistemske Postavke
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
          Upravljaj globalnim postavkama sistema
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#42a5f5" }} />
            <Typography variant="body2" sx={{ color: "#b0b0b0", ml: 2 }}>
              Učitavam postavke...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ bgcolor: "#ef4444", color: "#fff", mb: 2 }}>
            {error}
          </Alert>
        )}

        {settings && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.allow_registration}
                  onChange={() => handleSettingChange("allow_registration")}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#42a5f5",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#42a5f5",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Dozvoli Registraciju
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                    Omogući novim korisnicima da se registruju
                  </Typography>
                </Box>
              }
            />

          <Divider sx={{ bgcolor: "#333" }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.require_approval}
                  onChange={() => handleSettingChange("require_approval")}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#42a5f5",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#42a5f5",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Zahtijevaj Odobrenje
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                    Zahtjevi za promjenu role moraju biti odobreni
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ bgcolor: "#333" }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.email_notifications}
                  onChange={() => handleSettingChange("email_notifications")}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#42a5f5",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#42a5f5",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Email Obavještenja
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                    Šalji email obavještenja korisnicima
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ bgcolor: "#333" }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenance_mode}
                  onChange={() => handleSettingChange("maintenance_mode")}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#f97316",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#f97316",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Maintenance Mode
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                    Privremeno onemogući pristup sistemu
                  </Typography>
                </Box>
              }
            />

            <Divider sx={{ bgcolor: "#333" }} />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.auto_assignment}
                  onChange={() => handleSettingChange("auto_assignment")}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#10b981",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#10b981",
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    Automatska Dodjela
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#b0b0b0" }}>
                    Automatski dodijeli izvođače na osnovu dostupnosti
                  </Typography>
                </Box>
              }
            />
          </Box>
        )}

        {saved && (
          <Alert
            severity="success"
            sx={{
              mt: 2,
              bgcolor: "#10b981",
              color: "#fff",
              "& .MuiAlert-icon": { color: "#fff" },
            }}
          >
            Postavke su uspješno sačuvane!
          </Alert>
        )}

        {settings && (
          <Button
            fullWidth
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              mt: 2,
              bgcolor: "#42a5f5",
              "&:hover": { bgcolor: "#1976d2" },
              py: 1.5,
            }}
          >
            {saving ? "Čuvam..." : "Sačuvaj Postavke"}
          </Button>
        )}
      </Box>
    </Paper>
  )
}
