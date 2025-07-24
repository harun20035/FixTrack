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
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"
import SendIcon from "@mui/icons-material/Send"
import BugReportIcon from "@mui/icons-material/BugReport"
import ImageUpload from "./ImageUpload"
import type { IssueFormData, FormErrors, IssueCategory } from "../types"
import type { SelectChangeEvent } from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/navigation";

const FormCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 16,
}))

export default function IssueForm() {
  const [formData, setFormData] = useState<IssueFormData>({
    title: "",
    description: "",
    location: "",
    categoryId: "",
    images: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/issue-categories");
        if (!res.ok) throw new Error("Greška prilikom dohvata kategorija.");
        const data = await res.json();
        setCategories(data);
      } catch {
        // Optionally handle error (e.g., show a toast)
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof IssueFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: event.target.value,
    }));
    if (errors.categoryId) {
      setErrors((prev) => ({
        ...prev,
        categoryId: undefined,
      }));
    }
  };

  const handleImagesChange = (images: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Naslov je obavezan"
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Naslov mora imati najmanje 5 karaktera"
    } else if (formData.title.trim().length > 255) {
      newErrors.title = "Naslov ne može imati više od 255 karaktera"
    }

    // Category validation
    if (!formData.categoryId) {
      newErrors.categoryId = "Kategorija je obavezna"
    }

    // Description validation (optional but if provided, should have min length)
    if (formData.description && formData.description.trim().length < 10) {
      newErrors.description = "Opis mora imati najmanje 10 karaktera"
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

    try {
      const token = localStorage.getItem("auth_token");
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("location", formData.location);
      form.append("category_id", formData.categoryId);
      formData.images.forEach((img) => form.append("images", img));

      const res = await fetch("http://localhost:8000/api/issues", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Greška prilikom prijave kvara.");
      }
      setFormData({
        title: "",
        description: "",
        location: "",
        categoryId: "",
        images: [],
      });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting issue:", error)
      setErrors({ title: (error as Error).message });
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.id.toString() === formData.categoryId)

  return (
    <FormCard>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <BugReportIcon sx={{ fontSize: 32, color: "#42a5f5" }} />
          <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
            Prijavi Novi Kvar
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Molimo vas da detaljno opišete problem kako bismo mogli što brže reagovati i riješiti kvar.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Title */}
          <TextField
            label="Naslov Kvara"
            value={formData.title}
            onChange={handleInputChange("title")}
            error={!!errors.title}
            helperText={errors.title || "Kratko opišite problem (npr. 'Kvar na slavini u kupatilu')"}
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

          {/* Category */}
          <FormControl
            fullWidth
            required
            error={!!errors.categoryId}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
            }}
          >
            <InputLabel>Kategorija Kvara</InputLabel>
            <Select value={formData.categoryId} onChange={handleSelectChange} label="Kategorija Kvara">
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  <Box>
                    <Typography variant="body1">{category.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                      {category.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.categoryId}
              </Typography>
            )}
          </FormControl>

          {/* Selected Category Display */}
          {selectedCategory && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Odabrana kategorija:
              </Typography>
              <Chip label={selectedCategory.name} color="primary" variant="outlined" size="small" />
            </Box>
          )}

          {/* Location */}
          <TextField
            label="Lokacija"
            value={formData.location}
            onChange={handleInputChange("location")}
            helperText="Gdje se nalazi problem? (npr. 'Stan 15, kupatilo', 'Hodnik 2. sprat')"
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

          {/* Description */}
          <TextField
            label="Detaljni Opis"
            value={formData.description}
            onChange={handleInputChange("description")}
            error={!!errors.description}
            helperText={
              errors.description ||
              "Opišite problem što detaljnije. Kada se pojavio? Kako se manifestuje? Da li ste pokušali nešto riješiti?"
            }
            fullWidth
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
            }}
          />

          {/* Image Upload */}
          <ImageUpload images={formData.images} onImagesChange={handleImagesChange} />

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
                py: 1.5,
                fontSize: "1.1rem",
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
              {isLoading ? "Šalje se..." : "Prijavi Kvar"}
            </Button>
          </Box>
        </Box>
      </CardContent>
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={1500}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert elevation={6} variant="filled" severity="success" sx={{ width: "100%" }}>
          Uspješno ste prijavili kvar!
        </MuiAlert>
      </Snackbar>
    </FormCard>
  )
}
