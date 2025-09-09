"use client"
import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { styled } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import FilterListIcon from "@mui/icons-material/FilterList"
import ClearIcon from "@mui/icons-material/Clear"

const FilterCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
}))

interface IssueFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  onFilterChange: (filters: { searchTerm: string; selectedCategory: string; selectedStatus: string }) => void;
}

export default function IssueFilters({ searchTerm, selectedCategory, selectedStatus, onFilterChange }: IssueFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localStatus, setLocalStatus] = useState(selectedStatus);

  useEffect(() => {
    onFilterChange({ searchTerm: localSearch, selectedCategory: localCategory, selectedStatus: localStatus });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch, localCategory, localStatus]);

  const categories = [
    "Vodoinstalacije",
    "Elektroinstalacije",
    "Grijanje",
    "Lift",
    "Zajedničke Prostorije",
    "Fasada",
    "Krov",
    "Ostalo",
  ]

  const statuses = ["Primljeno", "Dodijeljeno", "U toku", "Čeka dijelove", "Završeno", "Otkazano"]

  const handleClearFilters = () => {
    setLocalSearch("");
    setLocalCategory("");
    setLocalStatus("");
  }

  return (
    <Box>
      <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Moje Prijave Kvarova
      </Typography>

      <FilterCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <FilterListIcon sx={{ color: "#42a5f5" }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Filteri i Pretraga
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "2fr 1fr 1fr auto",
              },
              gap: 2,
              alignItems: "end",
            }}
          >
            {/* Search */}
            <TextField
              label="Pretraži prijave"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Naslov, opis, lokacija..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "#42a5f5", mr: 1 }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#2a2a2a",
                  "& fieldset": { borderColor: "#333" },
                  "&:hover fieldset": { borderColor: "#42a5f5" },
                  "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                },
              }}
            />

            {/* Category Filter */}
            <FormControl
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#2a2a2a",
                  "& fieldset": { borderColor: "#333" },
                  "&:hover fieldset": { borderColor: "#42a5f5" },
                  "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                },
              }}
            >
              <InputLabel>Kategorija</InputLabel>
              <Select value={localCategory} onChange={(e) => setLocalCategory(e.target.value)} label="Kategorija">
                <MenuItem value="">Sve kategorije</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#2a2a2a",
                  "& fieldset": { borderColor: "#333" },
                  "&:hover fieldset": { borderColor: "#42a5f5" },
                  "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                },
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select value={localStatus} onChange={(e) => setLocalStatus(e.target.value)} label="Status">
                <MenuItem value="">Svi statusi</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Clear Filters */}
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{
                borderColor: "#333",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "#42a5f5",
                  color: "#42a5f5",
                },
              }}
            >
              Očisti
            </Button>
          </Box>
        </CardContent>
      </FilterCard>
    </Box>
  )
}
