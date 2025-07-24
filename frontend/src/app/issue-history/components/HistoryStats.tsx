"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { styled } from "@mui/material/styles"
import HistoryIcon from "@mui/icons-material/History"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import StarIcon from "@mui/icons-material/Star"
import { useEffect, useState } from "react"
import type { HistoryStats as StatsType, FilterOptions } from "../types"

const StatsCard = styled(Card)(() => ({
  background: "#1e1e1e",
  border: "1px solid #333",
  borderRadius: 12,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

interface HistoryStatsProps {
  filters: FilterOptions;
}

export default function HistoryStats({ filters }: HistoryStatsProps) {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    fetch("http://localhost:8000/api/issue-history/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [filters]);

  if (loading || !stats) return <Box sx={{ minHeight: 120 }} />;
  const statsArr = [
    {
      icon: <HistoryIcon sx={{ fontSize: 40, color: "#42a5f5" }} />,
      value: stats.totalIssues,
      label: "Ukupno Prijava",
      subtitle: "Svih vremena",
      color: "#42a5f5",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50" }} />,
      value: stats.completedIssues,
      label: "Završeno",
      subtitle: stats.totalIssues ? `${((stats.completedIssues / stats.totalIssues) * 100).toFixed(1)}% uspješnost` : "",
      color: "#4caf50",
    },
    {
      icon: <CancelIcon sx={{ fontSize: 40, color: "#f44336" }} />,
      value: stats.rejectedIssues,
      label: "Odbijeno",
      subtitle: stats.totalIssues ? `${((stats.rejectedIssues / stats.totalIssues) * 100).toFixed(1)}% odbačeno` : "",
      color: "#f44336",
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#ff9800" }} />,
      value: stats.inProgressIssues,
      label: "U toku",
      subtitle: stats.totalIssues ? `${((stats.inProgressIssues / stats.totalIssues) * 100).toFixed(1)}% u toku` : "",
      color: "#ff9800",
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: "#ffc107" }} />,
      value: stats.averageRating ? stats.averageRating.toFixed(2) : "-",
      label: "Prosječna Ocjena",
      subtitle: "od 5 zvjezdica",
      color: "#ffc107",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Historija Prijava Kvarova
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
        }}
      >
        {statsArr.map((stat, index) => (
          <StatsCard key={index}>
            <CardContent sx={{ textAlign: "center", p: 3 }}>
              <Box sx={{ mb: 2 }}>{stat.icon}</Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: stat.color }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
                {stat.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                {stat.subtitle}
              </Typography>
            </CardContent>
          </StatsCard>
        ))}
      </Box>
    </Box>
  )
}
