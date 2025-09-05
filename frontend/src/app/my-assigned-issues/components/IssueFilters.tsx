"use client"

import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid } from "@mui/material"
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
      category: "",
      priority: "",
      status: "",
    })
  }

  return (
    // @ts-ignore
    <Grid container spacing={2} alignItems="center">
      {/* @ts-ignore */}
      {/* @ts-ignore */}
      <Grid item xs={12} md={2}>
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
      </Grid>

      {/* @ts-ignore */}
      <Grid item xs={12} md={2}>
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
      </Grid>

      {/* @ts-ignore */}
      <Grid item xs={12} md={2}>
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
      </Grid>

      {/* @ts-ignore */}
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#b0b0b0" }}>Kategorija</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            sx={{
              bgcolor: "#1e1e1e",
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#42a5f5" },
            }}
          >
            <MenuItem value="">Sve</MenuItem>
            <MenuItem value="voda">Voda</MenuItem>
            <MenuItem value="struja">Struja</MenuItem>
            <MenuItem value="grijanje">Grijanje</MenuItem>
            <MenuItem value="ostalo">Ostalo</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* @ts-ignore */}
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#b0b0b0" }}>Prioritet</InputLabel>
          <Select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            sx={{
              bgcolor: "#1e1e1e",
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#42a5f5" },
            }}
          >
            <MenuItem value="">Svi</MenuItem>
            <MenuItem value="visok">Visok</MenuItem>
            <MenuItem value="srednji">Srednji</MenuItem>
            <MenuItem value="nizak">Nizak</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* @ts-ignore */}
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#b0b0b0" }}>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            sx={{
              bgcolor: "#1e1e1e",
              color: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#42a5f5" },
            }}
          >
            <MenuItem value="">Svi</MenuItem>
            <MenuItem value="Primljeno">Primljeno</MenuItem>
            <MenuItem value="Dodijeljeno izvođaču">Dodijeljeno izvođaču</MenuItem>
            <MenuItem value="Na lokaciji">Na lokaciji</MenuItem>
            <MenuItem value="Popravka u toku">Popravka u toku</MenuItem>
            <MenuItem value="Čeka dijelove">Čeka dijelove</MenuItem>
            <MenuItem value="Završeno">Završeno</MenuItem>
            <MenuItem value="Otkazano">Otkazano</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* @ts-ignore */}
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  )
}
