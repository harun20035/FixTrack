"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Radio from "@mui/material/Radio"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import CircularProgress from "@mui/material/CircularProgress"
import { authFetch } from "../../../utils/authFetch"

interface SurveyData {
  satisfaction_level: string
  issue_category: string
  description: string
  suggestions: string
  contact_preference: string
}

interface FormErrors {
  satisfaction_level?: string
  issue_category?: string
  description?: string
  suggestions?: string
  contact_preference?: string
  general?: string
}

export default function SurveyForm() {
  const [formData, setFormData] = useState<SurveyData>({
    satisfaction_level: "",
    issue_category: "",
    description: "",
    suggestions: "",
    contact_preference: "no"
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  })

  const handleInputChange = (field: keyof SurveyData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.satisfaction_level) {
      newErrors.satisfaction_level = "Molimo odaberite nivo zadovoljstva"
    }

    if (!formData.issue_category) {
      newErrors.issue_category = "Molimo odaberite kategoriju problema"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Molimo opišite problem"
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = "Opis mora imati najmanje 10 karaktera"
    }

    if (!formData.contact_preference) {
      newErrors.contact_preference = "Molimo odaberite preferencu kontakta"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authFetch("http://localhost:8000/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Vaša prijava nezadovoljstva je uspješno poslana. Hvala vam na povratnim informacijama!",
          severity: "success"
        })
        
        // Reset form
        setFormData({
          satisfaction_level: "",
          issue_category: "",
          description: "",
          suggestions: "",
          contact_preference: "no"
        })
      } else {
        const errorData = await response.json()
        setSnackbar({
          open: true,
          message: errorData.detail || "Greška pri slanju prijave. Molimo pokušajte ponovo.",
          severity: "error"
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Greška pri slanju prijave. Molimo pokušajte ponovo.",
        severity: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto" }}>
      {/* Satisfaction Level */}
      <FormControl component="fieldset" error={!!errors.satisfaction_level} sx={{ mb: 3, width: "100%" }}>
        <FormLabel component="legend" sx={{ color: "#42a5f5", mb: 2, fontWeight: 600 }}>
          Kako ocjenjujete ukupnu kvalitet usluge? *
        </FormLabel>
        <RadioGroup
          value={formData.satisfaction_level}
          onChange={handleInputChange("satisfaction_level")}
        >
          <FormControlLabel value="vrlo_zadovoljan" control={<Radio />} label="Vrlo zadovoljan" />
          <FormControlLabel value="zadovoljan" control={<Radio />} label="Zadovoljan" />
          <FormControlLabel value="neutralan" control={<Radio />} label="Neutralan" />
          <FormControlLabel value="nezadovoljan" control={<Radio />} label="Nezadovoljan" />
          <FormControlLabel value="vrlo_nezadovoljan" control={<Radio />} label="Vrlo nezadovoljan" />
        </RadioGroup>
        {errors.satisfaction_level && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            {errors.satisfaction_level}
          </Typography>
        )}
      </FormControl>

      {/* Issue Category */}
      <FormControl component="fieldset" error={!!errors.issue_category} sx={{ mb: 3, width: "100%" }}>
        <FormLabel component="legend" sx={{ color: "#42a5f5", mb: 2, fontWeight: 600 }}>
          Kategorija problema *
        </FormLabel>
        <RadioGroup
          value={formData.issue_category}
          onChange={handleInputChange("issue_category")}
        >
          <FormControlLabel value="voda" control={<Radio />} label="Voda" />
          <FormControlLabel value="struja" control={<Radio />} label="Struja" />
          <FormControlLabel value="grijanje" control={<Radio />} label="Grijanje" />
          <FormControlLabel value="lift" control={<Radio />} label="Lift" />
          <FormControlLabel value="sigurnost" control={<Radio />} label="Sigurnost" />
          <FormControlLabel value="čistoća" control={<Radio />} label="Čistoća" />
          <FormControlLabel value="komunikacija" control={<Radio />} label="Komunikacija sa upravnikom" />
          <FormControlLabel value="ostalo" control={<Radio />} label="Ostalo" />
        </RadioGroup>
        {errors.issue_category && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            {errors.issue_category}
          </Typography>
        )}
      </FormControl>

      {/* Description */}
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Opis problema *"
        value={formData.description}
        onChange={handleInputChange("description")}
        error={!!errors.description}
        helperText={errors.description || "Molimo detaljno opišite problem koji ste doživjeli"}
        sx={{ mb: 3 }}
      />

      {/* Suggestions */}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Predlozi za poboljšanje"
        value={formData.suggestions}
        onChange={handleInputChange("suggestions")}
        helperText="Imate li predloge kako bismo mogli poboljšati uslugu?"
        sx={{ mb: 3 }}
      />

      {/* Contact Preference */}
      <FormControl component="fieldset" error={!!errors.contact_preference} sx={{ mb: 4, width: "100%" }}>
        <FormLabel component="legend" sx={{ color: "#42a5f5", mb: 2, fontWeight: 600 }}>
          Želite li da vas kontaktira upravnik? *
        </FormLabel>
        <RadioGroup
          value={formData.contact_preference}
          onChange={handleInputChange("contact_preference")}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Da, molim kontakt" />
          <FormControlLabel value="no" control={<Radio />} label="Ne, hvala" />
        </RadioGroup>
        {errors.contact_preference && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            {errors.contact_preference}
          </Typography>
        )}
      </FormControl>

      {/* Submit Button */}
      <Box sx={{ textAlign: "center" }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            background: "linear-gradient(45deg, #f44336 30%, #d32f2f 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
            },
            px: 6,
            py: 1.5,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Pošalji Prijavu"
          )}
        </Button>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
