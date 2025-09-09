"use client"
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
import DateRangeIcon from "@mui/icons-material/DateRange"
import type { FilterOptions } from "../types"

const FilterCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
}))

interface HistoryFiltersProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}

export default function HistoryFilters({ filters, setFilters }: HistoryFiltersProps) {
  const handleChange = (field: keyof FilterOptions, value: string) => {
    setFilters({ ...filters, [field]: value });
  };
  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      category: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "created_at_desc",
    });
  };

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

  const sortOptions = [
    { value: "created_at_desc", label: "Najnovije prvo" },
    { value: "created_at_asc", label: "Najstarije prvo" },
    { value: "title_asc", label: "Naslov A-Z" },
    { value: "title_desc", label: "Naslov Z-A" },
    { value: "status_asc", label: "Status A-Z" },
    { value: "category_asc", label: "Kategorija A-Z" },
  ]

  return (
    <FilterCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <FilterListIcon sx={{ color: "#42a5f5" }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            Filteri i Pretraga
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* First Row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "2fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {/* Search */}
            <TextField
              label="Pretraži historiju"
              value={filters.searchTerm}
              onChange={(e) => handleChange("searchTerm", e.target.value)}
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
              <Select value={filters.category} onChange={(e) => handleChange("category", e.target.value)} label="Kategorija">
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
              <Select value={filters.status} onChange={(e) => handleChange("status", e.target.value)} label="Status">
                <MenuItem value="">Svi statusi</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Second Row */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr 1fr auto",
              },
              gap: 2,
              alignItems: "end",
            }}
          >
            {/* Date From */}
            <TextField
              label="Od datuma"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <DateRangeIcon sx={{ color: "#42a5f5", mr: 1 }} />,
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

            {/* Date To */}
            <TextField
              label="Do datuma"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#2a2a2a",
                  "& fieldset": { borderColor: "#333" },
                  "&:hover fieldset": { borderColor: "#42a5f5" },
                  "&.Mui-focused fieldset": { borderColor: "#42a5f5" },
                },
              }}
            />

            {/* Sort By */}
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
              <InputLabel>Sortiraj po</InputLabel>
              <Select value={filters.sortBy} onChange={(e) => handleChange("sortBy", e.target.value)} label="Sortiraj po">
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
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
        </Box>
      </CardContent>
    </FilterCard>
  )
}
