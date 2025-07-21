import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"

export default function QuickActions() {
  return (
    <Box sx={{ mb: 4 }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        sx={{
          background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
          },
          px: 4,
          py: 1.5,
        }}
      >
        Nova Prijava Kvara
      </Button>
    </Box>
  )
}
