"use client"
import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import StatusSection from "./StatusSection"
import type { Issue } from "../types"
import IssueFilters from "./IssueFilters";
import CircularProgress from "@mui/material/CircularProgress";

export default function IssuesList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // TODO: Add filter state and pass as query params
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:8000/api/my-issues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Greška prilikom dohvata prijava.");
        const data = await res.json();
        setIssues(data);
      } catch {
        setError("Greška prilikom dohvata prijava.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // In-memory filtering
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      !searchTerm ||
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (issue.location && issue.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory ||
      (typeof issue.category === "object" && issue.category !== null
        ? issue.category.name === selectedCategory
        : issue.category === selectedCategory);
    const matchesStatus = !selectedStatus || issue.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleFilterChange = (filters: { searchTerm: string; selectedCategory: string; selectedStatus: string }) => {
    setSearchTerm(filters.searchTerm);
    setSelectedCategory(filters.selectedCategory);
    setSelectedStatus(filters.selectedStatus);
  };

  const handleStatusChange = async (issueId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:8000/api/issues/${issueId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Greška prilikom promjene statusa.");
      const updated = await res.json();
      setIssues((prev) => prev.map((issue) => (issue.id === issueId ? { ...issue, status: updated.status, updatedAt: updated.updatedAt } : issue)));
    } catch {
      // Optionally show error
    }
  };

  const handleDelete = (issueId: number) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== issueId));
  };

  const handleEditSuccess = (updatedIssue: Issue) => {
    setIssues((prev) => prev.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue)));
  };

  const statuses = ["Primljeno", "Dodijeljeno izvođaču", "U toku", "Čeka dijelove", "Završeno", "Otkazano"]
  
  // Debug log za provjeru issue-ova
  console.log("All issues:", issues);
  console.log("Filtered issues:", filteredIssues);
  console.log("Issues by status:", statuses.map(status => ({
    status,
    count: filteredIssues.filter(issue => issue.status === status).length,
    issues: filteredIssues.filter(issue => issue.status === status)
  })));

  if (loading) return (
    <Box sx={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress color="primary" />
    </Box>
  );
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <IssueFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onFilterChange={handleFilterChange}
      />
      {statuses.map((status) => {
        const statusIssues = filteredIssues.filter((issue) => issue.status === status);
        const count = statusIssues.length;
        return (
          <StatusSection
            key={status}
            status={status}
            issues={statusIssues}
            count={count}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onEditSuccess={handleEditSuccess}
          />
        );
      })}
    </Box>
  );
}
