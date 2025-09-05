import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import AddIcon from "@mui/icons-material/Add"
import FeedbackIcon from "@mui/icons-material/Feedback"
import { useRouter } from "next/navigation"

export default function QuickActions() {
  const router = useRouter()

  const handleNewIssue = () => {
    router.push("/new-issue")
  }

  const handleSurvey = () => {
    router.push("/survey")
  }

  return (
    <Box sx={{ mb: 4 }}>
      <ButtonGroup variant="contained" size="large" sx={{ gap: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleNewIssue}
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
        <Button
          startIcon={<FeedbackIcon />}
          onClick={handleSurvey}
          sx={{
            background: "linear-gradient(45deg, #f44336 30%, #d32f2f 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
            },
            px: 4,
            py: 1.5,
          }}
        >
          Prijava Nezadovoljstva
        </Button>
      </ButtonGroup>
    </Box>
  )
}
