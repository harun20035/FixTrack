"use client"
import { useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import type { FilterOptions } from "../types"

interface IssueFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

export default function IssueFilters({ filters, onFilterChange }: IssueFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    const newFilters = { ...localFilters, [field]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters: FilterOptions = {
      searchTerm: "",
      dateFrom: "",
      dateTo: "",
      location: "",
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Search */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Pretraži po nazivu"
            value={localFilters.searchTerm}
            onChange={(e) => handleInputChange("searchTerm", e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#42a5f5", mr: 1 }} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
              "& .MuiInputLabel-root": { color: "#b0b0b0" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />
        </Grid>

        {/* Date From */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Datum od"
            value={localFilters.dateFrom}
            onChange={(e) => handleInputChange("dateFrom", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
              "& .MuiInputLabel-root": { color: "#b0b0b0" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />
        </Grid>

        {/* Date To */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Datum do"
            value={localFilters.dateTo}
            onChange={(e) => handleInputChange("dateTo", e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
              "& .MuiInputLabel-root": { color: "#b0b0b0" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />
        </Grid>

        {/* Location */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Adresa"
            value={localFilters.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#42a5f5", mr: 1 }} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#42a5f5" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
              "& .MuiInputLabel-root": { color: "#b0b0b0" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />
        </Grid>

        {/* Contractor filter removed - not applicable for "Primljeno" status issues */}
      </Grid>


      {/* Clear Filters Button */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          sx={{
            borderColor: "#666",
            color: "#b0b0b0",
            "&:hover": {
              borderColor: "#42a5f5",
              backgroundColor: "rgba(66, 165, 245, 0.1)",
            },
          }}
        >
          Obriši filtere
        </Button>
      </Box>
    </Box>
  )
}
