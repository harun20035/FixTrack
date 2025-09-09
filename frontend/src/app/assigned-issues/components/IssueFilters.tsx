"use client"
import { useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import type { FilterOptions } from "../types"

const FilterContainer = styled(Paper)(({ theme }) => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

interface IssueFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export default function IssueFilters({ filters, onFiltersChange }: IssueFiltersProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <FilterContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <FilterListIcon sx={{ color: "#42a5f5" }} />
        <Box sx={{ fontSize: "1.1rem", fontWeight: 600, color: "text.primary" }}>
          Filteri
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
        {/* Search */}
        <TextField
          fullWidth
          label="Pretraga po naslovu ili stanaru"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#333",
              },
              "&:hover fieldset": {
                borderColor: "#42a5f5",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#42a5f5",
              },
            },
          }}
        />

        {/* Status Filter */}
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            label="Status"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#333",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#42a5f5",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#42a5f5",
              },
            }}
          >
            <MenuItem value="">Svi statusi</MenuItem>
            <MenuItem value="Dodijeljeno">Dodijeljeno</MenuItem>
            <MenuItem value="U toku">U toku</MenuItem>
            <MenuItem value="Čeka dijelove">Čeka dijelove</MenuItem>
            <MenuItem value="Završeno">Završeno</MenuItem>
            <MenuItem value="Otkazano">Otkazano</MenuItem>
          </Select>
        </FormControl>

        {/* Date From */}
        <TextField
          fullWidth
          type="date"
          label="Od datuma"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#333",
              },
              "&:hover fieldset": {
                borderColor: "#42a5f5",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#42a5f5",
              },
            },
          }}
        />

        {/* Date To */}
        <TextField
          fullWidth
          type="date"
          label="Do datuma"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#333",
              },
              "&:hover fieldset": {
                borderColor: "#42a5f5",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#42a5f5",
              },
            },
          }}
        />
      </Box>
    </FilterContainer>
  )
} 