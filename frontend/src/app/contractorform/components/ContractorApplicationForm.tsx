"use client"
import { useState } from "react"
import type React from "react"

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import { styled } from "@mui/material/styles"
import SendIcon from "@mui/icons-material/Send"
import WorkIcon from "@mui/icons-material/Work"
import FileUpload from "./FileUpload"
import type { ContractorFormData, FormErrors } from "../types"

const FormCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 16,
}))

export default function ContractorApplicationForm() {
  const [formData, setFormData] = useState<ContractorFormData>({
    motivationLetter: "",
    reasonForBecomingContractor: "",
    experienceFile: null,
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (field: keyof ContractorFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === "acceptTerms" ? event.target.checked : event.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing/changing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      experienceFile: file,
    }))
    if (errors.experienceFile) {
      setErrors((prev) => ({
        ...prev,
        experienceFile: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Motivation letter validation
    if (!formData.motivationLetter.trim()) {
      newErrors.motivationLetter = "Motivaciono pismo je obavezno"
    } else if (formData.motivationLetter.trim().length < 50) {
      newErrors.motivationLetter = "Motivaciono pismo mora imati najmanje 50 karaktera"
    } else if (formData.motivationLetter.trim().length > 2000) {
      newErrors.motivationLetter = "Motivaciono pismo ne može imati više od 2000 karaktera"
    }

    // Reason validation
    if (!formData.reasonForBecomingContractor.trim()) {
      newErrors.reasonForBecomingContractor = "Razlog je obavezan"
    } else if (formData.reasonForBecomingContractor.trim().length < 20) {
      newErrors.reasonForBecomingContractor = "Razlog mora imati najmanje 20 karaktera"
    } else if (formData.reasonForBecomingContractor.trim().length > 1000) {
      newErrors.reasonForBecomingContractor = "Razlog ne može imati više od 1000 karaktera"
    }

    // Experience file validation (optional but if provided, must be PDF)
    if (formData.experienceFile) {
      if (formData.experienceFile.type !== "application/pdf") {
        newErrors.experienceFile = "Dozvoljen je samo PDF format"
      }
      if (formData.experienceFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        newErrors.experienceFile = "Fajl ne može biti veći od 10MB"
      }
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Morate prihvatiti uslove korišćenja"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSuccessMessage("")

    try {
      // Simulacija API poziva
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccessMessage(
        "Vaša prijava je uspješno poslana! Naš tim će pregledati vašu aplikaciju i kontaktirati vas u roku od 3-5 radnih dana.",
      )

      // Reset form after successful submission
      setFormData({
        motivationLetter: "",
        reasonForBecomingContractor: "",
        experienceFile: null,
        acceptTerms: false,
      })
    } catch (error) {
      console.error("Error submitting contractor application:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormCard>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <WorkIcon sx={{ fontSize: 32, color: "#42a5f5" }} />
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
            Prijava za Izvođača Radova
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
          Želite postati dio našeg tima izvođača? Popunite formu ispod i podijelite svoje iskustvo sa nama. Tražimo
          pouzdane i kvalifikovane izvođače koji mogu pomoći u rješavanju kvarova u stambenim objektima.
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, backgroundColor: "rgba(76, 175, 80, 0.1)" }}>
            {successMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Motivation Letter */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Motivaciono Pismo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Objasnite zašto želite raditi sa nama i šta možete doprinijeti našem timu.
            </Typography>
            <TextField
              label="Motivaciono Pismo"
              value={formData.motivationLetter}
              onChange={handleInputChange("motivationLetter")}
              error={!!errors.motivationLetter}
              helperText={
                errors.motivationLetter || `${formData.motivationLetter.length}/2000 karaktera (minimum 50 karaktera)`
              }
              required
              fullWidth
              multiline
              rows={6}
              placeholder="Poštovani, želim da se pridružim vašem timu jer..."
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

          <Divider sx={{ borderColor: "#333" }} />

          {/* Reason for Becoming Contractor */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Razlog za Postajanje Izvođača
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Opišite svoje vještine, iskustvo i razloge zašto želite biti izvođač radova.
            </Typography>
            <TextField
              label="Razlog za Postajanje Izvođača"
              value={formData.reasonForBecomingContractor}
              onChange={handleInputChange("reasonForBecomingContractor")}
              error={!!errors.reasonForBecomingContractor}
              helperText={
                errors.reasonForBecomingContractor ||
                `${formData.reasonForBecomingContractor.length}/1000 karaktera (minimum 20 karaktera)`
              }
              required
              fullWidth
              multiline
              rows={4}
              placeholder="Imam iskustvo u vodoinstalacijama, elektroinstalacijama..."
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

          <Divider sx={{ borderColor: "#333" }} />

          {/* Experience File Upload */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              CV / Iskustvo (Opciono)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Možete priložiti svoj CV ili dokument koji opisuje vaše radno iskustvo u PDF formatu.
            </Typography>
            <FileUpload file={formData.experienceFile} onFileChange={handleFileChange} error={errors.experienceFile} />
          </Box>

          <Divider sx={{ borderColor: "#333" }} />

          {/* Terms and Conditions */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Uslovi Korišćenja
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptTerms}
                  onChange={handleInputChange("acceptTerms")}
                  sx={{
                    color: "#42a5f5",
                    "&.Mui-checked": {
                      color: "#42a5f5",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Prihvatam{" "}
                  <Typography
                    component="span"
                    sx={{ color: "#42a5f5", cursor: "pointer", textDecoration: "underline" }}
                  >
                    uslove korišćenja
                  </Typography>{" "}
                  i{" "}
                  <Typography
                    component="span"
                    sx={{ color: "#42a5f5", cursor: "pointer", textDecoration: "underline" }}
                  >
                    politiku privatnosti
                  </Typography>
                  . Razumijem da će moji podaci biti korišćeni za procjenu moje aplikacije.
                </Typography>
              }
              sx={{ alignItems: "flex-start", mb: 1 }}
            />
            {errors.acceptTerms && (
              <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                {errors.acceptTerms}
              </Typography>
            )}
          </Box>

          {/* Additional Info */}
          <Box
            sx={{
              background: "#2a2a2a",
              border: "1px solid #333",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Šta Sljedeće?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              Nakon što pošaljete prijavu:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: "text.secondary" }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Naš tim će pregledati vašu aplikaciju u roku od 3-5 radnih dana
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Kontaktiraćemo vas putem email-a ili telefona za dodatne informacije
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Možda ćete biti pozvani na kratki razgovor ili test vještina
              </Typography>
              <Typography component="li" variant="body2">
                Uspješni kandidati će biti dodani u našu bazu izvođača
              </Typography>
            </Box>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              disabled={isLoading}
              sx={{
                px: 6,
                py: 2,
                fontSize: "1.2rem",
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
              {isLoading ? "Šalje se..." : "Pošalji Prijavu"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </FormCard>
  )
}
