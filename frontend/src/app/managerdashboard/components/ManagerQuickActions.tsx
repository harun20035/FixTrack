import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"

export default function ManagerQuickActions() {
  return (
    <Box sx={{ mb: 4 }}>
      <ButtonGroup
        variant="contained"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          "& .MuiButtonGroup-grouped": {
            border: "none",
            "&:not(:last-of-type)": {
              borderRight: "none",
            },
          },
        }}
      >
        <Button
          startIcon={<AssignmentIndIcon />}
          sx={{
            background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
            },
            px: 3,
            py: 1.5,
          }}
        >
          Dodijeli Izvođača
        </Button>
        <Button
          startIcon={<AddIcon />}
          sx={{
            background: "linear-gradient(45deg, #4caf50 30%, #388e3c 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #388e3c 30%, #4caf50 90%)",
            },
            px: 3,
            py: 1.5,
          }}
        >
          Dodaj Napomenu
        </Button>
        <Button
          startIcon={<SearchIcon />}
          sx={{
            background: "linear-gradient(45deg, #ff9800 30%, #f57c00 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #f57c00 30%, #ff9800 90%)",
            },
            px: 3,
            py: 1.5,
          }}
        >
          Pretraži Prijave
        </Button>
        <Button
          startIcon={<NotificationsActiveIcon />}
          sx={{
            background: "linear-gradient(45deg, #9c27b0 30%, #7b1fa2 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)",
            },
            px: 3,
            py: 1.5,
          }}
        >
          Pošalji Obavještenje
        </Button>
      </ButtonGroup>
    </Box>
  )
}
