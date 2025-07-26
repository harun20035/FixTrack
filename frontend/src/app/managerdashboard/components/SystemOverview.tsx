import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"
import Chip from "@mui/material/Chip"
import { styled } from "@mui/material/styles"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PeopleIcon from "@mui/icons-material/People"
import BuildIcon from "@mui/icons-material/Build"
import HomeIcon from "@mui/icons-material/Home"

const OverviewCard = styled(Card)(({ theme }) => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

export default function SystemOverview() {
  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Pregled Sistema
      </Typography>

      {/* Monthly Performance */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <TrendingUpIcon sx={{ color: "#42a5f5" }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Mjesečna Performansa
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Riješeno 27 od 35 prijava
          </Typography>
          <LinearProgress
            variant="determinate"
            value={77}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#333",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#4caf50",
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "right" }}>
            77% uspješnost
          </Typography>
        </CardContent>
      </OverviewCard>

      {/* Active Resources */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Aktivni Resursi
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PeopleIcon sx={{ fontSize: 20, color: "#42a5f5" }} />
                <Typography variant="body2">Stanari</Typography>
              </Box>
              <Chip label="156" color="primary" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BuildIcon sx={{ fontSize: 20, color: "#42a5f5" }} />
                <Typography variant="body2">Izvođači</Typography>
              </Box>
              <Chip label="12" color="secondary" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HomeIcon sx={{ fontSize: 20, color: "#42a5f5" }} />
                <Typography variant="body2">Zgrade</Typography>
              </Box>
              <Chip label="8" color="success" size="small" />
            </Box>
          </Box>
        </CardContent>
      </OverviewCard>

      {/* Recent Activity Summary */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Nedavna Aktivnost
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                Nova prijava - Stan 28
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prije 15 minuta
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                Zadatak završen - Lift
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prije 1 sat
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                Izvođač dodijeljen
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prije 2 sata
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </OverviewCard>

      {/* Quick Stats */}
      <OverviewCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
            Brze Statistike
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="#4caf50" sx={{ fontWeight: 700 }}>
                2.8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prosječno vrijeme (dani)
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="#ff9800" sx={{ fontWeight: 700 }}>
                94%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zadovoljstvo stanara
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </OverviewCard>
    </Box>
  )
}
