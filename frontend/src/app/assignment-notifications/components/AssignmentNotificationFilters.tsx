"use client"
import { Dispatch, SetStateAction } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Badge from "@mui/material/Badge"
import { styled } from "@mui/material/styles"
import AssignmentIcon from "@mui/icons-material/Assignment"
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead"

const FilterCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
}))

interface AssignmentNotificationFiltersProps {
  filter: "all" | "unread" | "read"
  setFilter: Dispatch<SetStateAction<"all" | "unread" | "read">>
  counts: { all: number; unread: number; read: number }
  onMarkAllAsRead: () => void
  loading: boolean
}

export default function AssignmentNotificationFilters({ filter, setFilter, counts, onMarkAllAsRead, loading }: AssignmentNotificationFiltersProps) {
  return (
    <Box>
      <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        <AssignmentIcon sx={{ mr: 2, verticalAlign: "middle" }} />
        Notifikacije o Zadacima
      </Typography>

      <FilterCard>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <ButtonGroup variant="outlined" sx={{ "& .MuiButton-root": { borderColor: "#333" } }}>
              <Button
                variant={filter === "all" ? "contained" : "outlined"}
                onClick={() => setFilter("all")}
                sx={{
                  color: filter === "all" ? "white" : "#42a5f5",
                  backgroundColor: filter === "all" ? "#42a5f5" : "transparent",
                  "&:hover": {
                    backgroundColor: filter === "all" ? "#1976d2" : "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                <Badge badgeContent={counts.all} color="primary" sx={{ "& .MuiBadge-badge": { right: -12, top: -8 } }}>
                  Sve
                </Badge>
              </Button>
              <Button
                variant={filter === "unread" ? "contained" : "outlined"}
                onClick={() => setFilter("unread")}
                sx={{
                  color: filter === "unread" ? "white" : "#42a5f5",
                  backgroundColor: filter === "unread" ? "#42a5f5" : "transparent",
                  "&:hover": {
                    backgroundColor: filter === "unread" ? "#1976d2" : "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                <Badge badgeContent={counts.unread} color="error" sx={{ "& .MuiBadge-badge": { right: -12, top: -8 } }}>
                  Nepročitano
                </Badge>
              </Button>
              <Button
                variant={filter === "read" ? "contained" : "outlined"}
                onClick={() => setFilter("read")}
                sx={{
                  color: filter === "read" ? "white" : "#42a5f5",
                  backgroundColor: filter === "read" ? "#42a5f5" : "transparent",
                  "&:hover": {
                    backgroundColor: filter === "read" ? "#1976d2" : "rgba(66, 165, 245, 0.1)",
                  },
                }}
              >
                <Badge badgeContent={counts.read} color="success" sx={{ "& .MuiBadge-badge": { right: -12, top: -8 } }}>
                  Pročitano
                </Badge>
              </Button>
            </ButtonGroup>

            <Button
              variant="outlined"
              startIcon={<MarkEmailReadIcon />}
              onClick={onMarkAllAsRead}
              disabled={counts.unread === 0 || loading}
              sx={{
                borderColor: "#333",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "#42a5f5",
                  color: "#42a5f5",
                },
                "&:disabled": {
                  borderColor: "#333",
                  color: "#666",
                },
              }}
            >
              Označi Sve kao Pročitano
            </Button>
          </Box>
        </CardContent>
      </FilterCard>
    </Box>
  )
}
