"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import Divider from "@mui/material/Divider"
import { styled } from "@mui/material/styles"
import SaveIcon from "@mui/icons-material/Save"
import LockIcon from "@mui/icons-material/Lock"

import type { UserProfile } from "../types";

const FormCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 16,
}))

interface ProfileFormProps {
  profile: UserProfile;
  refetchProfile: () => void;
}

interface ProfileFormData {
  fullName: string
  email: string
  phone: string
  address: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  phone?: string
  address?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

export default function ProfileForm({ profile, refetchProfile }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: profile.full_name,
    email: profile.email,
    phone: profile.phone || "",
    address: profile.address || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setFormData({
      fullName: profile.full_name,
      email: profile.email,
      phone: profile.phone || "",
      address: profile.address || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [profile]);

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (field: keyof ProfileFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ime i prezime je obavezno"
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Ime i prezime mora imati najmanje 2 karaktera"
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = "Ime i prezime ne može imati više od 100 karaktera"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email je obavezan"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email format nije valjan"
    } else if (formData.email.length > 100) {
      newErrors.email = "Email ne može imati više od 100 karaktera"
    }

    // Phone validation (optional)
    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = "Telefon ne može imati više od 20 karaktera"
    }

    // Password validation (only if changing password)
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Trenutna lozinka je obavezna"
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "Nova lozinka je obavezna"
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Nova lozinka mora imati najmanje 6 karaktera"
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Lozinke se ne poklapaju"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      };
      const res = await fetch("http://localhost:8000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Greška prilikom ažuriranja profila.");
      }
      setSuccessMessage("Profil je uspješno ažuriran!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      refetchProfile();
    } catch (error) {
      setSuccessMessage("");
      const msg = (error as Error).message;
      if (msg.toLowerCase().includes("lozinka") || msg.toLowerCase().includes("šifra")) {
        setErrors({ currentPassword: msg });
      } else if (msg.toLowerCase().includes("poklapaju")) {
        setErrors({ confirmPassword: msg });
      } else if (msg.toLowerCase().includes("email")) {
        setErrors({ email: msg });
      } else {
        setErrors({ fullName: msg });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Uredi Profil
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, backgroundColor: "rgba(76, 175, 80, 0.1)" }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Personal Information */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Lični Podaci
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Ime i Prezime"
                value={formData.fullName}
                onChange={handleInputChange("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                }}
              />
              <TextField
                label="Telefon"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                }}
              />
              <TextField
                label="Adresa"
                value={formData.address}
                onChange={handleInputChange("address")}
                fullWidth
                multiline
                rows={2}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#333" }} />

          {/* Password Change */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              <LockIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Promjena Lozinke
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ostavite prazno ako ne želite mijenjati lozinku
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Trenutna Lozinka"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange("currentPassword")}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                }}
              />
              <TextField
                label="Nova Lozinka"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                }}
              />
              <TextField
                label="Potvrdi Novu Lozinku"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#2a2a2a",
                    "& fieldset": { borderColor: "#333" },
                    "&:hover fieldset": { borderColor: "#42a5f5" },
                    "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              disabled={isLoading}
              sx={{
                px: 4,
                py: 1.5,
                background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                },
                "&:disabled": {
                  background: "#333",
                  color: "#666",
                },
              }}
            >
              {isLoading ? "Čuvanje..." : "Sačuvaj Promjene"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </FormCard>
  )
}
