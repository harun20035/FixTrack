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
      category: "all",
      priority: "all",
      address: "",
      contractor: "",
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Search */}
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

        {/* Category */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#b0b0b0" }}>Kategorija</InputLabel>
            <Select
              value={localFilters.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              label="Kategorija"
              sx={{
                backgroundColor: "#2a2a2a",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#42a5f5" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#42a5f5" },
                "& .MuiSelect-select": { color: "#fff" },
              }}
            >
              <MenuItem value="all">Sve kategorije</MenuItem>
              <MenuItem value="voda">Voda</MenuItem>
              <MenuItem value="struja">Struja</MenuItem>
              <MenuItem value="grijanje">Grijanje</MenuItem>
              <MenuItem value="ostalo">Ostalo</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Priority */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#b0b0b0" }}>Prioritet</InputLabel>
            <Select
              value={localFilters.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              label="Prioritet"
              sx={{
                backgroundColor: "#2a2a2a",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#42a5f5" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#42a5f5" },
                "& .MuiSelect-select": { color: "#fff" },
              }}
            >
              <MenuItem value="all">Svi prioriteti</MenuItem>
              <MenuItem value="visok">Visok</MenuItem>
              <MenuItem value="srednji">Srednji</MenuItem>
              <MenuItem value="nizak">Nizak</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Second Row */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Address Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Pretraži po adresi"
            value={localFilters.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
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

        {/* Contractor Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Pretraži po izvođaču"
            value={localFilters.contractor}
            onChange={(e) => handleInputChange("contractor", e.target.value)}
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
