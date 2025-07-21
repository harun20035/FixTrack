import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Link from "@mui/material/Link"
import Divider from "@mui/material/Divider"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "#0f0f0f",
        color: "text.secondary",
        pt: 6,
        pb: 3,
        borderTop: "1px solid #333",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
            mb: 4,
          }}
        >
          {/* Company Info */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              FixTrack
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Napredni sistem za upravljanje prijavom kvarova u stambenim objektima. Jednostavno, brzo i efikasno.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Brzi Linkovi
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                O Nama
              </Link>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                Kako Funkcioniše
              </Link>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                Cjenovnik
              </Link>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                FAQ
              </Link>
            </Box>
          </Box>

          {/* Support */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Podrška
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                Kontakt
              </Link>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                Pomoć
              </Link>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                Uslovi Korišćenja
              </Link>
              <Link href="#" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                Privatnost
              </Link>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              Kontakt
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2">info@fixtrack.ba</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2">+387 33 123 456</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="body2">Sarajevo, BiH</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#333" }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} FixTrack &ndash; Sva prava zadržana. Razvio Harun Hasagić
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
