"use client"
import Box from "@mui/material/Box"
import type React from "react"

import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PersonIcon from "@mui/icons-material/Person"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import ImageIcon from "@mui/icons-material/Image"
import type { Issue, IssueCategory } from "../types"
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import { authFetch } from "../../../utils/authFetch";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Rating from "@mui/material/Rating";

const IssueCardStyled = styled(Card)(() => ({
  background: "#2a2a2a",
  border: "1px solid #333",
  borderRadius: 12,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#42a5f5",
    boxShadow: "0 4px 20px rgba(66, 165, 245, 0.1)",
  },
}))

interface IssueCardProps {
  issue: Issue
  onStatusChange: (issueId: number, newStatus: string) => void
  onDelete?: (issueId: number) => void
  onEditSuccess?: (updatedIssue: Issue) => void
}

export default function IssueCard({ issue, onStatusChange, onDelete, onEditSuccess }: IssueCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: issue.title,
    description: issue.description || "",
    location: issue.location || "",
    category: typeof issue.category === "object" && issue.category !== null ? issue.category.name : issue.category,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<{ id: number; user_name?: string; content: string; created_at: string }[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [addCommentLoading, setAddCommentLoading] = useState(false);
  const [addCommentError, setAddCommentError] = useState("");
  const [ratingOpen, setRatingOpen] = useState(false);
  const [addRatingOpen, setAddRatingOpen] = useState(false);
  const [rating, setRating] = useState<{ id: number; score: number; comment?: string } | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newRatingComment, setNewRatingComment] = useState("");
  const [addRatingLoading, setAddRatingLoading] = useState(false);
  const [addRatingError, setAddRatingError] = useState("");

  // Fetch categories when edit dialog opens
  useEffect(() => {
    if (editDialogOpen) {
      setCategoriesLoading(true);
      setCategoriesError("");
      fetch("http://localhost:8000/api/issue-categories")
        .then(res => res.json())
        .then((data: IssueCategory[]) => {
          setCategories(data.map((cat) => cat.name));
          setEditData(d => ({
            ...d,
            category: typeof issue.category === "object" && issue.category !== null ? issue.category.name : issue.category
          }));
        })
        .catch(() => setCategoriesError("Greška prilikom dohvata kategorija."))
        .finally(() => setCategoriesLoading(false));
    }
  }, [editDialogOpen]);

  // Fetch comments
  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentsError("");
    try {
      const res = await authFetch(`http://localhost:8000/api/issues/${issue.id}/comments`);
      if (!res.ok) throw new Error("Greška prilikom dohvata komentara.");
      const data = await res.json();
      setComments(data);
    } catch (e) {
      setCommentsError((e as Error).message);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Fetch rating
  const fetchRating = async () => {
    setRatingLoading(true);
    setRatingError("");
    try {
      const res = await authFetch(`http://localhost:8000/api/issues/${issue.id}/rating`);
      if (!res.ok) throw new Error("Greška prilikom dohvata ocjene.");
      const data = await res.json();
      setRating(data);
    } catch (e) {
      setRatingError((e as Error).message);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(issue.id, newStatus)
    handleMenuClose()
  }

  const handleOpenGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };
  const handleCloseGallery = () => setGalleryOpen(false);
  const handlePrevImage = () => setGalleryIndex((prev) => (prev === 0 ? (issue.images.length - 1) : prev - 1));
  const handleNextImage = () => setGalleryIndex((prev) => (prev === issue.images.length - 1 ? 0 : prev + 1));

  const handleOpenComments = () => {
    setCommentsOpen(true);
    fetchComments();
  };
  const handleCloseComments = () => setCommentsOpen(false);

  // Add comment modal
  const handleOpenAddComment = () => {
    setAddCommentOpen(true);
    setNewComment("");
    setAddCommentError("");
  };
  const handleCloseAddComment = () => setAddCommentOpen(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setAddCommentLoading(true);
    setAddCommentError("");
    try {
      const res = await authFetch(`http://localhost:8000/api/issues/${issue.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (!res.ok) throw new Error("Greška prilikom dodavanja komentara.");
      setNewComment("");
      setAddCommentOpen(false);
      fetchComments();
      setCommentsOpen(true);
    } catch (e) {
      setAddCommentError((e as Error).message);
    } finally {
      setAddCommentLoading(false);
    }
  };

  const handleOpenRating = () => {
    setRatingOpen(true);
    fetchRating();
  };
  const handleCloseRating = () => setRatingOpen(false);

  const handleOpenAddRating = () => {
    setAddRatingOpen(true);
    setNewRating(null);
    setNewRatingComment("");
    setAddRatingError("");
  };
  const handleCloseAddRating = () => setAddRatingOpen(false);

  const handleAddRating = async () => {
    if (!newRating) return;
    setAddRatingLoading(true);
    setAddRatingError("");
    try {
      const res = await authFetch(`http://localhost:8000/api/issues/${issue.id}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newRating, comment: newRatingComment }),
      });
      if (!res.ok) throw new Error("Greška prilikom slanja ocjene.");
      setAddRatingOpen(false);
      fetchRating();
      setRatingOpen(true);
    } catch (e) {
      setAddRatingError((e as Error).message);
    } finally {
      setAddRatingLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Vodoinstalacije":
        return "#2196f3"
      case "Elektroinstalacije":
        return "#ff9800"
      case "Grijanje":
        return "#f44336"
      case "Lift":
        return "#9c27b0"
      case "Zajedničke Prostorije":
        return "#4caf50"
      case "Fasada":
        return "#795548"
      case "Krov":
        return "#607d8b"
      default:
        return "#42a5f5"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bs-BA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const availableStatuses = ["Primljeno", "Dodijeljeno", "U toku", "Čeka dijelove", "Završeno", "Odbijeno"].filter(
    (status) => status !== issue.status,
  )

  const baseUrl = "http://localhost:8000/";

  const handleDelete = async () => {
    setDeleteDialogOpen(false);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await authFetch(`http://localhost:8000/api/issues/${issue.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        if (onDelete) onDelete(issue.id);
      } else {
        alert("Greška prilikom brisanja prijave.");
      }
    } catch {
      alert("Greška prilikom brisanja prijave.");
    }
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("auth_token");
      const res = await authFetch(`http://localhost:8000/api/issues/${issue.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editData.title,
          description: editData.description,
          location: editData.location,
          category_id: categories.indexOf(editData.category) + 1,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Greška prilikom uređivanja prijave.");
      }
      const updated = await res.json();
      setEditDialogOpen(false);
      if (onEditSuccess) onEditSuccess(updated);
    } catch (e) {
      setEditError((e as Error).message);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <IssueCardStyled>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
              {issue.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Chip
                label={typeof issue.category === "object" && issue.category !== null ? issue.category.name : issue.category}
                size="small"
                sx={{
                  backgroundColor: getCategoryColor(typeof issue.category === "object" && issue.category !== null ? issue.category.name : String(issue.category)),
                  color: "white",
                  fontWeight: 500,
                }}
              />
              {issue.images.length > 0 && (
                <Chip
                  icon={<ImageIcon />}
                  label={`${issue.images.length} slika`}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: "#42a5f5", color: "#42a5f5", cursor: "pointer" }}
                  onClick={() => handleOpenGallery(0)}
                />
              )}
            </Box>
          </Box>
          <IconButton onClick={handleMenuOpen} sx={{ color: "text.secondary" }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Description */}
        {issue.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
            {issue.description}
          </Typography>
        )}

        {/* Details */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
          {issue.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                {issue.location}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
            <Typography variant="body2" color="text.secondary">
              Prijavljeno: {formatDate(issue.created_at)}
            </Typography>
          </Box>
          {issue.assignedTo && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ fontSize: 16, color: "#42a5f5" }} />
              <Typography variant="body2" color="text.secondary">
                Dodijeljeno: {issue.assignedTo}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {issue.status === "Primljeno" && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditDialogOpen(true)}
                sx={{ color: "#42a5f5", borderColor: "#42a5f5" }}
              >
                Uredi
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ color: "#f44336", borderColor: "#f44336" }}
              >
                Izbriši
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ChatBubbleOutlineIcon />}
                onClick={handleOpenComments}
                sx={{ color: "#4caf50", borderColor: "#4caf50" }}
              >
                Komentari
              </Button>
            </Box>
          )}
          {issue.status === "Završeno" && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<StarBorderIcon />}
              onClick={handleOpenRating}
              sx={{ color: "#ffb300", borderColor: "#ffb300" }}
            >
              Ocjena
            </Button>
          )}
        </Box>

        {/* Status Change Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {issue.status === "Primljeno" && (
            <MenuItem onClick={() => { handleOpenAddComment(); handleMenuClose(); }}>
              <Typography variant="subtitle2" color="text.secondary">
                Dodaj komentar
              </Typography>
            </MenuItem>
          )}
          {issue.status === "Završeno" && (
            <MenuItem onClick={() => { handleOpenAddRating(); handleMenuClose(); }}>
              <Typography variant="subtitle2" color="text.secondary">
                Ocijeni uslugu
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </CardContent>
      {/* Image Gallery Modal */}
      <Dialog open={galleryOpen} onClose={handleCloseGallery} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: "relative", p: 0, background: "#181818" }}>
          <IconButton onClick={handleCloseGallery} sx={{ position: "absolute", top: 8, right: 8, zIndex: 2, color: "#fff" }}>
            <CloseIcon />
          </IconButton>
          {issue.images.length > 1 && (
            <IconButton onClick={handlePrevImage} sx={{ position: "absolute", top: "50%", left: 8, zIndex: 2, color: "#fff", transform: "translateY(-50%)" }}>
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          {issue.images.length > 1 && (
            <IconButton onClick={handleNextImage} sx={{ position: "absolute", top: "50%", right: 48, zIndex: 2, color: "#fff", transform: "translateY(-50%)" }}>
              <ArrowForwardIosIcon />
            </IconButton>
          )}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, background: "#181818" }}>
            <Image
              src={(() => {
                const img = issue.images[galleryIndex];
                let url = typeof img === "object" && img !== null ? (img as { image_url?: string }).image_url : img;
                if (typeof url === "string" && url && !url.startsWith("http")) url = baseUrl + url.replace(/^\/+/, "");
                return typeof url === "string" ? url : undefined;
              })() || ""}
              alt={`Slika ${galleryIndex + 1}`}
              width={800}
              height={500}
              style={{ maxWidth: "100%", maxHeight: 500, borderRadius: 8, objectFit: "contain" }}
              unoptimized
            />
          </Box>
          <Box sx={{ textAlign: "center", color: "#fff", pb: 2 }}>
            {galleryIndex + 1} / {issue.images.length}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrda brisanja</DialogTitle>
        <DialogContent>Da li ste sigurni da želite izbrisati ovu prijavu?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Izbriši</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Uredi prijavu</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Naslov"
            value={editData.title}
            onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Opis"
            value={editData.description}
            onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Lokacija"
            value={editData.location}
            onChange={e => setEditData(d => ({ ...d, location: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Kategorija"
            select
            value={editData.category}
            onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
            fullWidth
            disabled={categoriesLoading}
            helperText={categoriesError || ""}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
          {editError && <Typography color="error">{editError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={editLoading}>
            Sačuvaj
          </Button>
        </DialogActions>
      </Dialog>

      {/* Komentari Modal */}
      <Dialog open={commentsOpen} onClose={handleCloseComments} maxWidth="sm" fullWidth>
        <DialogTitle>Komentari</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 200 }}>
          {commentsLoading ? (
            <Typography color="primary">Učitavanje komentara...</Typography>
          ) : commentsError ? (
            <Typography color="error">{commentsError}</Typography>
          ) : comments.length === 0 ? (
            <Typography color="text.secondary">Nema komentara za ovu prijavu.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {comments.map((c) => (
                <Box key={c.id} sx={{ p: 2, background: "#232323", borderRadius: 2 }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>{c.user_name || "Korisnik"}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>{new Date(c.created_at).toLocaleString("bs-BA")}</Typography>
                  <Typography variant="body2" color="text.secondary">{c.content}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComments}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      {/* Dodaj komentar Modal */}
      <Dialog open={addCommentOpen} onClose={handleCloseAddComment} maxWidth="xs" fullWidth>
        <DialogTitle>Dodaj komentar</DialogTitle>
        <DialogContent>
          <TextField
            label="Komentar"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            autoFocus
            sx={{ mt: 1 }}
          />
          {addCommentError && <Typography color="error" sx={{ mt: 1 }}>{addCommentError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddComment}>Otkaži</Button>
          <Button onClick={handleAddComment} variant="contained" disabled={addCommentLoading || !newComment.trim()}>
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ocjena Modal (prikaz) */}
      <Dialog open={ratingOpen} onClose={handleCloseRating} maxWidth="xs" fullWidth>
        <DialogTitle>Vaša ocjena usluge</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 120 }}>
          {ratingLoading ? (
            <Typography color="primary">Učitavanje ocjene...</Typography>
          ) : ratingError ? (
            <Typography color="error">{ratingError}</Typography>
          ) : !rating ? (
            <Typography color="text.secondary">Niste još ocijenili ovu uslugu.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Rating value={rating.score} readOnly max={5} sx={{ fontSize: 40 }} />
              {rating.comment && <Typography variant="body2" color="text.secondary">{rating.comment}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRating}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      {/* Dodaj ocjenu Modal */}
      <Dialog open={addRatingOpen} onClose={handleCloseAddRating} maxWidth="xs" fullWidth>
        <DialogTitle>Ocijeni uslugu</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 1 }}>
            <Rating
              value={newRating}
              onChange={(_, value) => setNewRating(value)}
              max={5}
              sx={{ fontSize: 40 }}
            />
            <TextField
              label="Komentar (opcionalno)"
              value={newRatingComment}
              onChange={e => setNewRatingComment(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
            {addRatingError && <Typography color="error">{addRatingError}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddRating}>Otkaži</Button>
          <Button onClick={handleAddRating} variant="contained" disabled={addRatingLoading || !newRating}>
            Sačuvaj
          </Button>
        </DialogActions>
      </Dialog>
    </IssueCardStyled>
  )
}