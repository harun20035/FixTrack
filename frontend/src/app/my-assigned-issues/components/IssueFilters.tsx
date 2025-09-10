"use client"

import { TextField, MenuItem, Button, Grid } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import type { FilterState } from "../types"

interface IssueFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export default function IssueFilters({ filters, onFiltersChange }: IssueFiltersProps) {
  const handleFilterChange = (field: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [field]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      dateFrom: "",
      dateTo: "",
      location: "",
      status: "",
    })
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
      <div style={{ flex: '1', minWidth: '200px' }}>
        <TextField
          fullWidth
          placeholder="Pretraži..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "#666", mr: 1 }} />,
            sx: {
              bgcolor: "#1e1e1e",
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#666" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
            },
          }}
        />
      </div>

      <div style={{ flex: '1', minWidth: '200px' }}>
        <TextField
          fullWidth
          type="date"
          label="Datum od"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiInputLabel-root": { color: "#b0b0b0" },
            "& .MuiOutlinedInput-root": {
              bgcolor: "#1e1e1e",
              color: "#fff",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#666" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
          }}
        />
      </div>

      <div style={{ flex: '1', minWidth: '200px' }}>
        <TextField
          fullWidth
          type="date"
          label="Datum do"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiInputLabel-root": { color: "#b0b0b0" },
            "& .MuiOutlinedInput-root": {
              bgcolor: "#1e1e1e",
              color: "#fff",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#666" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
          }}
        />
      </div>

      <div style={{ flex: '1', minWidth: '200px' }}>
        <TextField
          fullWidth
          placeholder="Lokacija..."
          value={filters.location || ""}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "#666", mr: 1 }} />,
            sx: {
              bgcolor: "#1e1e1e",
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": { borderColor: "#444" },
                "&:hover fieldset": { borderColor: "#666" },
                "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
              },
            },
          }}
        />
      </div>

      <div style={{ flex: '1', minWidth: '200px' }}>
        <TextField
          fullWidth
          select
          label="Status"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiInputLabel-root": { color: "#b0b0b0" },
            "& .MuiOutlinedInput-root": {
              bgcolor: "#1e1e1e",
              color: "#fff",
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#666" },
              "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
            },
          }}
        >
          <MenuItem value="">Svi statusi</MenuItem>
          <MenuItem value="Primljeno">Primljeno</MenuItem>
          <MenuItem value="Dodijeljeno izvođaču">Dodijeljeno izvođaču</MenuItem>
          <MenuItem value="Na lokaciji">Na lokaciji</MenuItem>
          <MenuItem value="Popravka u toku">Popravka u toku</MenuItem>
          <MenuItem value="Čeka dijelove">Čeka dijelove</MenuItem>
          <MenuItem value="Završeno">Završeno</MenuItem>
          <MenuItem value="Otkazano">Otkazano</MenuItem>
        </TextField>
      </div>

      <div style={{ flex: '0 0 auto' }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={clearFilters}
          sx={{
            color: "#b0b0b0",
            borderColor: "#444",
            "&:hover": {
              borderColor: "#666",
              bgcolor: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Obriši Filtere
        </Button>
      </div>
    </div>
  )
}
