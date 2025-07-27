"use client"
import { useState, useMemo, useEffect } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import Chip from "@mui/material/Chip"
import IssueCard from "./IssueCard"
import type { FilterOptions, Issue } from "../types"
import { authFetch } from "../../../utils/authFetch"

interface IssuesListProps {
  filters: FilterOptions
}

interface Contractor {
  id: number
  full_name: string
  email: string
  phone: string | null
  active_assignments_count: number
  is_available: boolean
}

export default function IssuesList({ filters }: IssuesListProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assigningIssue, setAssigningIssue] = useState<string | null>(null)
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [showContractorModal, setShowContractorModal] = useState(false)
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [loadingContractors, setLoadingContractors] = useState(false)

  // Dohvati podatke iz API-ja
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        params.append('status', 'Primljeno')
        
      if (filters.searchTerm) {
          params.append('search', filters.searchTerm)
        }
        if (filters.category && filters.category !== 'all') {
          params.append('category', filters.category)
        }
        if (filters.dateFrom) {
          params.append('date_from', filters.dateFrom)
        }
        if (filters.dateTo) {
          params.append('date_to', filters.dateTo)
        }
        params.append('sort_by', 'created_at_desc')
        
        const response = await authFetch(`http://localhost:8000/api/manager/all-issues?${params}`)
        
        if (!response.ok) {
          throw new Error('Greška prilikom dohvata prijava')
        }
        
        const data = await response.json()
        
        // Transformiraj podatke u format koji očekuje frontend
        const transformedIssues: Issue[] = data.map((issue: any) => ({
          id: issue.id.toString(),
          title: issue.title,
          description: issue.description || '',
          category: issue.category?.name || 'ostalo',
          priority: 'srednji', // Backend ne podržava priority još
          status: issue.status,
          createdAt: issue.created_at,
          tenant: {
            name: issue.tenant?.full_name || 'Nepoznato',
            apartment: issue.tenant?.address || 'Nepoznato',
            phone: issue.tenant?.phone || 'Nepoznato',
          },
          location: issue.location || 'Nepoznato',
          images: issue.images?.map((img: any) => `http://localhost:8000/${img.image_url}`) || [],
        }))
        
        setIssues(transformedIssues)
      } catch (err) {
        console.error('Error fetching issues:', err)
        setError(err instanceof Error ? err.message : 'Greška prilikom dohvata podataka')
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [filters])

  const handleAssignContractor = async (issueId: string) => {
    setSelectedIssueId(issueId)
    setShowContractorModal(true)
    
    try {
      setLoadingContractors(true)
      const contractorsResponse = await authFetch('http://localhost:8000/api/manager/contractors')
      if (!contractorsResponse.ok) {
        throw new Error('Greška prilikom dohvata izvođača')
      }
      
      const contractorsData = await contractorsResponse.json()
      setContractors(contractorsData)
    } catch (err) {
      console.error('Error fetching contractors:', err)
      alert(err instanceof Error ? err.message : 'Greška prilikom dohvata izvođača')
      setShowContractorModal(false)
    } finally {
      setLoadingContractors(false)
    }
  }

  const handleSelectContractor = async (contractorId: number) => {
    if (!selectedIssueId) return
    
    setAssigningIssue(selectedIssueId)
    setShowContractorModal(false)
    
    try {
      const assignResponse = await authFetch(`http://localhost:8000/api/manager/issues/${selectedIssueId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractor_id: contractorId }),
      })
      
      if (!assignResponse.ok) {
        const errorData = await assignResponse.json()
        throw new Error(errorData.detail || 'Greška prilikom dodjele izvođača')
      }
      
      // Ukloni prijavu iz liste jer više nema status "Primljeno"
      setIssues(prev => prev.filter(issue => issue.id !== selectedIssueId))
      
      alert('Izvođač je uspješno dodijeljen prijavi!')
    } catch (err) {
      console.error('Error assigning contractor:', err)
      alert(err instanceof Error ? err.message : 'Greška prilikom dodjele izvođača')
    } finally {
    setAssigningIssue(null)
      setSelectedIssueId(null)
    }
  }

  const handleCloseModal = () => {
    setShowContractorModal(false)
    setSelectedIssueId(null)
    setContractors([])
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  if (issues.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" sx={{ color: "#b0b0b0", mb: 2 }}>
          Nema prijava sa statusom "Primljeno"
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Sve prijave su već dodijeljene izvođačima ili ne postoje nove prijave
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ color: "#42a5f5", mb: 3, fontWeight: 600 }}>
        Pronađeno {issues.length} prijava sa statusom "Primljeno"
      </Typography>

      <Grid container spacing={3}>
        {issues.map((issue) => (
          <Grid item xs={12} lg={6} key={issue.id}>
            <IssueCard
              issue={issue}
              onAssignContractor={handleAssignContractor}
              isAssigning={assigningIssue === issue.id}
            />
          </Grid>
        ))}
      </Grid>

      {/* Modal za izbor izvođača */}
      <Dialog 
        open={showContractorModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e1e1e',
            color: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ color: '#42a5f5', borderBottom: '1px solid #333' }}>
          Odaberite izvođača
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {loadingContractors ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : contractors.length === 0 ? (
            <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 4 }}>
              Nema dostupnih izvođača
            </Typography>
          ) : (
            <List>
              {contractors.map((contractor) => (
                <ListItem 
                  key={contractor.id}
                  sx={{
                    border: '1px solid #333',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(66, 165, 245, 0.1)',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                          {contractor.full_name}
                        </Typography>
                        {contractor.is_available ? (
                          <Chip 
                            label="Dostupan" 
                            size="small" 
                            sx={{ backgroundColor: '#4caf50', color: '#fff' }}
                          />
                        ) : (
                          <Chip 
                            label="Zauzet" 
                            size="small" 
                            sx={{ backgroundColor: '#f44336', color: '#fff' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          Email: {contractor.email}
                        </Typography>
                        {contractor.phone && (
                          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                            Telefon: {contractor.phone}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          Aktivnih zadataka: {contractor.active_assignments_count}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      size="small"
                      disabled={!contractor.is_available}
                      onClick={() => handleSelectContractor(contractor.id)}
                      sx={{
                        backgroundColor: contractor.is_available ? '#42a5f5' : '#666',
                        '&:hover': {
                          backgroundColor: contractor.is_available ? '#1976d2' : '#666',
                        }
                      }}
                    >
                      Odaberi
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#b0b0b0' }}>
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
