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
import BusinessIcon from "@mui/icons-material/Business"
import WarningIcon from "@mui/icons-material/Warning"
import FileUpload from "./FileUpload"
import type { ManagerFormData, FormErrors } from "../types"

const FormCard = styled(Card)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 16,
}))

const WarningBox = styled(Box)(({ theme }) => ({
  background: "rgba(244, 67, 54, 0.1)",
  border: "1px solid rgba(244, 67, 54, 0.3)",
  borderRadius: 8,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}))

export default function ManagerApplicationForm() {
  const [formData, setFormData] = useState<ManagerFormData>({
    motivationLetter: "",
    managementExperience: "",
    buildingManagementPlans: "",
    experienceFile: null,
    acceptTerms: false,
    acceptRoleChange: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (field: keyof ManagerFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === "acceptTerms" || field === "acceptRoleChange" ? event.target.checked : event.target.value
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

    // Management experience validation
    if (!formData.managementExperience.trim()) {
      newErrors.managementExperience = "Iskustvo u upravljanju je obavezno"
    } else if (formData.managementExperience.trim().length < 50) {
      newErrors.managementExperience = "Iskustvo u upravljanju mora imati najmanje 50 karaktera"
    } else if (formData.managementExperience.trim().length > 2000) {
      newErrors.managementExperience = "Iskustvo u upravljanju ne može imati više od 2000 karaktera"
    }

    // Building management plans validation
    if (!formData.buildingManagementPlans.trim()) {
      newErrors.buildingManagementPlans = "Planovi za upravljanje zgradama su obavezni"
    } else if (formData.buildingManagementPlans.trim().length < 50) {
      newErrors.buildingManagementPlans = "Planovi za upravljanje zgradama moraju imati najmanje 50 karaktera"
    } else if (formData.buildingManagementPlans.trim().length > 2000) {
      newErrors.buildingManagementPlans = "Planovi za upravljanje zgradama ne mogu imati više od 2000 karaktera"
    }

    // Experience file validation (required)
    if (!formData.experienceFile) {
      newErrors.experienceFile = "CV je obavezan"
    } else {
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

    // Role change acceptance validation
    if (!formData.acceptRoleChange) {
      newErrors.acceptRoleChange = "Morate potvrditi da prihvatate promjenu uloge"
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
        managementExperience: "",
        buildingManagementPlans: "",
        experienceFile: null,
        acceptTerms: false,
        acceptRoleChange: false,
      })
    } catch (error) {
      console.error("Error submitting manager application:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormCard>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <BusinessIcon sx={{ fontSize: 32, color: "#42a5f5" }} />
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
            Prijava za Upravnika
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
          Želite postati upravnik zgrada? Popunite formu ispod i podijelite svoje iskustvo i planove sa nama. Tražimo
          pouzdane i kvalifikovane upravnike koji mogu efikasno upravljati stambenim objektima.
        </Typography>

        {/* Warning about role change */}
        <WarningBox>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <WarningIcon sx={{ color: "#f44336", mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" color="#f44336" sx={{ fontWeight: 600, mb: 1 }}>
                Važna napomena o promjeni uloge
              </Typography>
              <Typography variant="body2" sx={{ color: "#f44336", opacity: 0.9, lineHeight: 1.6 }}>
                Prihvatanjem uloge upravnika, gubite status i mogućnosti stanara i/ili izvođača. Ovo znači da nećete
                moći koristiti funkcionalnosti koje su dostupne stanarima ili izvođačima. Vaš korisnički račun će biti
                konvertovan isključivo u račun upravnika.
              </Typography>
            </Box>
          </Box>
        </WarningBox>

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
              Objasnite zašto želite biti upravnik i šta vas kvalifikuje za ovu ulogu.
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
              placeholder="Poštovani, želim da se prijavim za poziciju upravnika jer..."
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

          {/* Management Experience */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Iskustvo u Upravljanju
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Opišite svoje prethodno iskustvo u upravljanju objektima, timovima ili projektima.
            </Typography>
            <TextField
              label="Iskustvo u Upravljanju"
              value={formData.managementExperience}
              onChange={handleInputChange("managementExperience")}
              error={!!errors.managementExperience}
              helperText={
                errors.managementExperience ||
                `${formData.managementExperience.length}/2000 karaktera (minimum 50 karaktera)`
              }
              required
              fullWidth
              multiline
              rows={5}
              placeholder="Imam X godina iskustva u upravljanju stambenim objektima..."
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

          {/* Building Management Plans */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Planovi za Upravljanje Zgradama
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Opišite vaše planove i pristup upravljanju stambenim objektima. Koje metode i strategije biste koristili?
            </Typography>
            <TextField
              label="Planovi za Upravljanje Zgradama"
              value={formData.buildingManagementPlans}
              onChange={handleInputChange("buildingManagementPlans")}
              error={!!errors.buildingManagementPlans}
              helperText={
                errors.buildingManagementPlans ||
                `${formData.buildingManagementPlans.length}/2000 karaktera (minimum 50 karaktera)`
              }
              required
              fullWidth
              multiline
              rows={5}
              placeholder="Moj pristup upravljanju zgradama uključuje..."
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

          {/* Experience File Upload (Required) */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              CV / Iskustvo (Obavezno)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Priložite svoj CV ili dokument koji detaljno opisuje vaše radno iskustvo u PDF formatu.
            </Typography>
            <FileUpload
              file={formData.experienceFile}
              onFileChange={handleFileChange}
              error={errors.experienceFile}
              required={true}
            />
          </Box>

          <Divider sx={{ borderColor: "#333" }} />

          {/* Role Change Confirmation */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Potvrda Promjene Uloge
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptRoleChange}
                  onChange={handleInputChange("acceptRoleChange")}
                  sx={{
                    color: "#f44336",
                    "&.Mui-checked": {
                      color: "#f44336",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: "#f44336" }}>
                  Razumijem i prihvatam da ću prihvatanjem uloge upravnika izgubiti status i mogućnosti stanara i/ili
                  izvođača. Moj korisnički račun će biti konvertovan isključivo u račun upravnika.
                </Typography>
              }
              sx={{ alignItems: "flex-start", mb: 1 }}
            />
            {errors.acceptRoleChange && (
              <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                {errors.acceptRoleChange}
              </Typography>
            )}
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
                Kontaktiraćemo vas putem email-a ili telefona za zakazivanje intervjua
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Bićete pozvani na razgovor sa našim timom za procjenu
              </Typography>
              <Typography component="li" variant="body2">
                Uspješni kandidati će proći kroz proces obuke prije preuzimanja uloge upravnika
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
