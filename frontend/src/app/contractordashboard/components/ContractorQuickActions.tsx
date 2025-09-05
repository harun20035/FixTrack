import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function ContractorQuickActions() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
        Pregled dodijeljenih zadataka
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Koristite sidebar za navigaciju kroz različite funkcionalnosti sistema.
      </Typography>
    </Box>
  )
}
