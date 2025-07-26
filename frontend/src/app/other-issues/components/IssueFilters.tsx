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
import type { FilterState } from "../types"

interface IssueFiltersProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onClearFilters: () => void
}

export function IssueFilters({ filters, onFilterChange, onClearFilters }: IssueFiltersProps) {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Pretraži po nazivu, opisu ili stanaru..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
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
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Od datuma"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
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
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Do datuma"
            value={filters.dateTo}
            onChange={(e) => onFilterChange({ dateTo: e.target.value })}
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

        {/* Category */}
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#b0b0b0" }}>Kategorija</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              sx={{
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
                "& .MuiSelect-select": {
                  color: "#fff",
                },
                "& .MuiSvgIcon-root": {
                  color: "#b0b0b0",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    "& .MuiMenuItem-root": {
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(66, 165, 245, 0.1)",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">Sve kategorije</MenuItem>
              <MenuItem value="voda">Voda</MenuItem>
              <MenuItem value="struja">Struja</MenuItem>
              <MenuItem value="grijanje">Grijanje</MenuItem>
              <MenuItem value="ostalo">Ostalo</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Priority */}
        <Grid item xs={12} md={1}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#b0b0b0" }}>Prioritet</InputLabel>
            <Select
              value={filters.priority}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              sx={{
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
                "& .MuiSelect-select": {
                  color: "#fff",
                },
                "& .MuiSvgIcon-root": {
                  color: "#b0b0b0",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    "& .MuiMenuItem-root": {
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(66, 165, 245, 0.1)",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">Svi</MenuItem>
              <MenuItem value="visok">Visok</MenuItem>
              <MenuItem value="srednji">Srednji</MenuItem>
              <MenuItem value="nizak">Nizak</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={1}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#b0b0b0" }}>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              sx={{
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
                "& .MuiSelect-select": {
                  color: "#fff",
                },
                "& .MuiSvgIcon-root": {
                  color: "#b0b0b0",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    "& .MuiMenuItem-root": {
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "rgba(66, 165, 245, 0.1)",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">Svi statusi</MenuItem>
              <MenuItem value="u toku">U Toku</MenuItem>
              <MenuItem value="završeno">Završeno</MenuItem>
              <MenuItem value="na čekanju">Na Čekanju</MenuItem>
              <MenuItem value="otkazano">Otkazano</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Clear Filters Button */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          sx={{
            borderColor: "#666",
            color: "#b0b0b0",
            "&:hover": {
              borderColor: "#42a5f5",
              backgroundColor: "rgba(66, 165, 245, 0.1)",
              color: "#42a5f5",
            },
          }}
        >
          Obriši Filtere
        </Button>
      </Box>
    </Box>
  )
}
