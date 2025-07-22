"use client"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import BuildIcon from "@mui/icons-material/Build"
import PeopleIcon from "@mui/icons-material/People"
import TrackChangesIcon from "@mui/icons-material/TrackChanges"
import SecurityIcon from "@mui/icons-material/Security"
import SpeedIcon from "@mui/icons-material/Speed"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const HeroSection = styled(Box)(() => ({
  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  minHeight: "70vh",
  display: "flex",
  alignItems: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 50% 50%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)",
  },
}))

const FeatureCard = styled(Card)(() => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  transition: "all 0.3s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    borderColor: "#42a5f5",
    boxShadow: "0 10px 30px rgba(66, 165, 245, 0.2)",
  },
}))

const StatsSection = styled(Paper)(({ theme }) => ({
  background: "#1e1e1e",
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0),
  border: "1px solid #333",
}))

export default function HomePage() {

  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);
  const whyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      router.replace("/dashboard");
    } else {
      setRedirecting(false);
    }
  }, [router]);

  if (redirecting) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Preusmjeravanje...</Typography>
      </Box>
    );
  }

  const features = [
    {
      icon: <BuildIcon sx={{ fontSize: 40, color: "#42a5f5" }} />,
      title: "Prijava Kvarova",
      description: "Jednostavno prijavite kvar sa detaljnim opisom, slikama i lokacijom u vašoj zgradi.",
    },
    {
      icon: <TrackChangesIcon sx={{ fontSize: 40, color: "#42a5f5" }} />,
      title: "Praćenje Statusa",
      description: "Pratite status vaše prijave u realnom vremenu od prijave do završetka popravke.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#42a5f5" }} />,
      title: "Komunikacija",
      description: "Direktna komunikacija između stanara, upravnika i izvođača radova.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: "#42a5f5" }} />,
      title: "Brza Reakcija",
      description: "Automatsko obavještavanje i brza dodjela zadataka odgovarajućim izvođačima.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: "#42a5f5" }} />,
      title: "Sigurnost Podataka",
      description: "Vaši podaci su sigurni i dostupni samo ovlaštenim korisnicima.",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#42a5f5" }} />,
      title: "24/7 Podrška",
      description: "Naš tim je uvijek spreman da vam pomogne sa bilo kojim pitanjem.",
    },
  ]

  return (
    <>
      <Header />

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", minHeight: "inherit" }}>
            <Box sx={{ maxWidth: "66.666667%", pr: { md: 4 } }}>
              <Typography
                variant="h2"
                color="primary"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  mb: 3,
                }}
              >
                Dobrodošli u FixTrack
              </Typography>
              <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 3, lineHeight: 1.4 }}>
                Napredni sistem za upravljanje prijavom kvarova u stambenim objektima
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: "1.1rem", lineHeight: 1.6 }}>
                Prijavite kvar, pratite status popravke i unaprijedite kvalitet života u vašoj zgradi. FixTrack
                omogućava jednostavnu komunikaciju između stanara, upravnika i izvođača radova.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                    },
                  }}
                  onClick={() => router.push("/register")}
                >
                  Počnite Odmah
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderColor: "#42a5f5",
                    color: "#42a5f5",
                    "&:hover": {
                      borderColor: "#1976d2",
                      background: "rgba(66, 165, 245, 0.1)",
                    },
                  }}
                  onClick={() => {
                    if (whyRef.current) {
                      whyRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Saznajte Više
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Container maxWidth="lg">
        <StatsSection elevation={0}>
          <Box sx={{ display: "flex", justifyContent: "space-around", textAlign: "center", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ minWidth: "200px" }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                500+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Riješenih Kvarova
              </Typography>
            </Box>
            <Box sx={{ minWidth: "200px" }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                50+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Stambenih Objekata
              </Typography>
            </Box>
            <Box sx={{ minWidth: "200px" }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                24h
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Prosječno Vrijeme Odgovora
              </Typography>
            </Box>
          </Box>
        </StatsSection>
      </Container>

      {/* Features Section */}
      <Box ref={whyRef} sx={{ py: 8, background: "#1a1a1a" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" color="primary" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
            Zašto Odabrati FixTrack?
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 4,
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, background: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)" }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Spremni za Početak?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.5 }}>
            Pridružite se stotinama zadovoljnih korisnika koji već koriste FixTrack za upravljanje kvarovima u svojim
            zgradama.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/register")}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              background: "linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              },
            }}
          >
            Registrujte se Besplatno
          </Button>
        </Container>
      </Box>

      <Footer />
    </>
  )
}
