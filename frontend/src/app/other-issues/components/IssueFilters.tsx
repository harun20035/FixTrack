"use client"

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

export function IssueFilters({ filters, onFilterChange }: IssueFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: "",
      dateFrom: "",
      dateTo: "",
      location: "",
    })
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Search */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Pretraži po nazivu, opisu ili stanaru..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#42a5f5", mr: 1 }} />,
              sx: {
                backgroundColor: "#2a2a2a",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#444",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "& input": {
                  color: "#fff",
                },
                "& input::placeholder": {
                  color: "#b0b0b0",
                },
              },
            }}
          />
        </Grid>

        {/* Date From */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Od datuma"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            InputLabelProps={{
              shrink: true,
              sx: { color: "#b0b0b0" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#42a5f5",
                },
                "& input": {
                  color: "#fff",
                },
              },
            }}
          />
        </Grid>

        {/* Date To */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Do datuma"
            value={filters.dateTo}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            InputLabelProps={{
              shrink: true,
              sx: { color: "#b0b0b0" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#2a2a2a",
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#42a5f5",
                },
                "& input": {
                  color: "#fff",
                },
              },
            }}
          />
        </Grid>

        {/* Location Search */}
        {/* @ts-ignore */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            placeholder="Adresa..."
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#42a5f5", mr: 1 }} />,
              sx: {
                backgroundColor: "#2a2a2a",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#444",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#42a5f5",
                },
                "& input": {
                  color: "#fff",
                },
                "& input::placeholder": {
                  color: "#b0b0b0",
                },
              },
            }}
          />
        </Grid>

        {/* Contractor filter removed */}

      </Grid>

      {/* Clear Filters Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          sx={{
            color: "#42a5f5",
            borderColor: "#42a5f5",
            "&:hover": {
              backgroundColor: "rgba(66, 165, 245, 0.1)",
              borderColor: "#1976d2",
            },
          }}
          variant="outlined"
        >
          Očisti filtere
        </Button>
      </Box>
    </Box>
  )
}
