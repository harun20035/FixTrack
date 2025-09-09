"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material"
import {
  Visibility,
  Person,
  Category,
  Star,
  Message,
  Lightbulb,
  ContactPhone,
  CalendarToday,
} from "@mui/icons-material"
import { authFetch } from "@/utils/authFetch"

interface Survey {
  id: number
  tenant_id: number
  issue_id?: number
  satisfaction_level: string
  issue_category: string
  description: string
  suggestions?: string
  contact_preference: string
  created_at: string
  tenant?: {
    id: number
    full_name: string
    email: string
  }
}

interface SurveyStats {
  total_surveys: number
  satisfaction_levels: {
    vrlo_zadovoljan: number
    zadovoljan: number
    neutralan: number
    nezadovoljan: number
    vrlo_nezadovoljan: number
  }
  categories: {
    [key: string]: number
  }
}

const getSatisfactionColor = (level: string) => {
  switch (level) {
    case "vrlo_zadovoljan":
      return "success"
    case "zadovoljan":
      return "primary"
    case "neutralan":
      return "default"
    case "nezadovoljan":
      return "warning"
    case "vrlo_nezadovoljan":
      return "error"
    default:
      return "default"
  }
}

const getSatisfactionText = (level: string) => {
  switch (level) {
    case "vrlo_zadovoljan":
      return "Vrlo zadovoljan"
    case "zadovoljan":
      return "Zadovoljan"
    case "neutralan":
      return "Neutralan"
    case "nezadovoljan":
      return "Nezadovoljan"
    case "vrlo_nezadovoljan":
      return "Vrlo nezadovoljan"
    default:
      return level
  }
}

const getCategoryText = (category: string) => {
  switch (category) {
    case "voda":
      return "Voda"
    case "struja":
      return "Struja"
    case "grijanje":
      return "Grijanje"
    case "lift":
      return "Lift"
    case "sigurnost":
      return "Sigurnost"
    case "čistoća":
      return "Čistoća"
    case "komunikacija":
      return "Komunikacija"
    case "ostalo":
      return "Ostalo"
    default:
      return category
  }
}

export default function SurveyManagement() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      setError(null)

       const [surveysResponse, statsResponse] = await Promise.all([
         authFetch("http://localhost:8000/api/surveys/all"),
         authFetch("http://localhost:8000/api/surveys/stats"),
       ])

      if (surveysResponse.ok) {
        const surveysData = await surveysResponse.json()
        setSurveys(surveysData)
      } else {
        const errorText = await surveysResponse.text()
        throw new Error(`Greška pri dohvaćanju prijava nezadovoljstva: ${surveysResponse.status} - ${errorText}`)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepoznata greška")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys()
  }, [])

  const handleViewDetails = (survey: Survey) => {
    setSelectedSurvey(survey)
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedSurvey(null)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        Prijave nezadovoljstva (stanari i izvođači)
      </Typography>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {stats.total_surveys}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ukupno prijava
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {stats.satisfaction_levels.vrlo_zadovoljan + stats.satisfaction_levels.zadovoljan}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Zadovoljni korisnici
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {stats.satisfaction_levels.nezadovoljan + stats.satisfaction_levels.vrlo_nezadovoljan}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nezadovoljni korisnici
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: "#1e1e1e", color: "#fff" }}>
              <CardContent>
                <Typography variant="h4" color="info.main">
                  {stats.satisfaction_levels.neutralan}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Neutralni korisnici
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Surveys Table */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#1e1e1e",
          border: "1px solid #333",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  ID
                </TableCell>
                 <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                   Korisnik
                 </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Kategorija
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Zadovoljstvo
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Datum
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Akcije
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "#fff" }}>
                    Nema prijava nezadovoljstva
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow key={survey.id} hover>
                    <TableCell sx={{ color: "#fff" }}>
                      #{survey.id}
                    </TableCell>
                     <TableCell sx={{ color: "#fff" }}>
                       {survey.tenant ? survey.tenant.full_name : `Korisnik #${survey.tenant_id}`}
                     </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {getCategoryText(survey.issue_category)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getSatisfactionText(survey.satisfaction_level)}
                        color={getSatisfactionColor(survey.satisfaction_level) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {new Date(survey.created_at).toLocaleDateString("hr-HR")}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleViewDetails(survey)}
                        sx={{ color: "#42a5f5" }}
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Survey Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1e1e1e",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", borderBottom: "1px solid #333" }}>
          Detalji prijave nezadovoljstva #{selectedSurvey?.id}
        </DialogTitle>
         <DialogContent sx={{ pt: 2, mt: 2 }}>
          {selectedSurvey && (
            <Box>
              <Grid container spacing={2}>
                {/* @ts-ignore */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Person sx={{ color: "#42a5f5" }} />
                    <Typography variant="body2" color="text.secondary">
                      Korisnik:
                    </Typography>
                  </Box>
                   <Typography variant="body1" sx={{ color: "#fff", mb: 2 }}>
                     {selectedSurvey.tenant ? selectedSurvey.tenant.full_name : `Korisnik #${selectedSurvey.tenant_id}`}
                   </Typography>
                </Grid>

                {/* @ts-ignore */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Category sx={{ color: "#42a5f5" }} />
                    <Typography variant="body2" color="text.secondary">
                      Kategorija:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#fff", mb: 2 }}>
                    {getCategoryText(selectedSurvey.issue_category)}
                  </Typography>
                </Grid>

                {/* @ts-ignore */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Star sx={{ color: "#42a5f5" }} />
                    <Typography variant="body2" color="text.secondary">
                      Nivo zadovoljstva:
                    </Typography>
                  </Box>
                  <Chip
                    label={getSatisfactionText(selectedSurvey.satisfaction_level)}
                    color={getSatisfactionColor(selectedSurvey.satisfaction_level) as any}
                    sx={{ mb: 2 }}
                  />
                </Grid>

                {/* @ts-ignore */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CalendarToday sx={{ color: "#42a5f5" }} />
                    <Typography variant="body2" color="text.secondary">
                      Datum prijave:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#fff", mb: 2 }}>
                    {new Date(selectedSurvey.created_at).toLocaleString("hr-HR")}
                  </Typography>
                </Grid>

                {/* @ts-ignore */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Message sx={{ color: "#42a5f5" }} />
                    <Typography variant="body2" color="text.secondary">
                      Opis problema:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#fff", mb: 2, whiteSpace: "pre-wrap" }}>
                    {selectedSurvey.description}
                  </Typography>
                </Grid>

                {selectedSurvey.suggestions && (
                  /* @ts-ignore */
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Lightbulb sx={{ color: "#42a5f5" }} />
                      <Typography variant="body2" color="text.secondary">
                        Prijedlozi za poboljšanje:
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "#fff", mb: 2, whiteSpace: "pre-wrap" }}>
                      {selectedSurvey.suggestions}
                    </Typography>
                  </Grid>
                )}

                {/* @ts-ignore */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <ContactPhone sx={{ color: "#42a5f5" }} />
                    <Typography variant="body2" color="text.secondary">
                      Želi kontakt:
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: "#fff" }}>
                    {selectedSurvey.contact_preference === "yes" ? "Da" : "Ne"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #333" }}>
          <Button onClick={handleCloseDetails} sx={{ color: "#42a5f5" }}>
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
