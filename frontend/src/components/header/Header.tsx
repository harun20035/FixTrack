"use client"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon"
import { useRouter } from "next/navigation"

function FixTrackIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32" fontSize="large">
      <circle cx="16" cy="16" r="15" fill="#42a5f5" />
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#111" />
    </SvgIcon>
  )
}

export default function Header() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleRegister = () => {
    router.push("/register")
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        background: "#181818",
        borderBottom: "1px solid #333",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleHome}
        >
          <FixTrackIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: 700,
              "&:hover": {
                color: "#1976d2",
              },
            }}
          >
            FixTrack
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLogin}
            sx={{
              borderColor: "#42a5f5",
              color: "#42a5f5",
              "&:hover": {
                borderColor: "#1976d2",
                background: "rgba(66, 165, 245, 0.1)",
              },
            }}
          >
            Prijava
          </Button>
          <Button
            variant="contained"
            onClick={handleRegister}
            sx={{
              background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              },
            }}
          >
            Registracija
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
