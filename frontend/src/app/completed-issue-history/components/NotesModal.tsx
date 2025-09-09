"use client"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import NotesIcon from "@mui/icons-material/Notes"

interface NotesModalProps {
  open: boolean
  onClose: () => void
  notes: string[]
  issueTitle: string
}

export default function NotesModal({ open, onClose, notes, issueTitle }: NotesModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#2a2a2a",
          border: "1px solid #333",
        },
      }}
    >
      <DialogTitle sx={{ color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <NotesIcon sx={{ color: "#42a5f5" }} />
          <Typography variant="h6">Bilješke - {issueTitle}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#b0b0b0" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {notes.length > 0 ? (
          <List>
            {notes.map((note, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#42a5f5",
                      mt: 1,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={note}
                  primaryTypographyProps={{
                    sx: { color: "#fff", fontSize: "1rem" },
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ color: "#b0b0b0", textAlign: "center", py: 4 }}>
            Nema dostupnih bilješki za ovaj kvar.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#42a5f5",
            "&:hover": { bgcolor: "#1976d2" },
            textTransform: "none",
          }}
        >
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  )
}
