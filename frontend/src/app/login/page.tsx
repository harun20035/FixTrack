"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(true);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Greška prilikom prijave.");
      } else {
        const data = await res.json();
        if (data && data.auth_token) {
          localStorage.setItem("auth_token", data.auth_token);
        }
        setSuccess("Prijava uspješna! Preusmjeravanje...");
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Greška na serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper elevation={4} sx={{ p: 4, minWidth: 340, maxWidth: 400, width: "100%", textAlign: "center", background: "#181818" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Prijava
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              disabled={loading || !!success}
            />
            <TextField
              label="Lozinka"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
              disabled={loading || !!success}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Button type="submit" variant="contained" color="primary" disabled={loading || !!success} sx={{ mt: 1 }}>
              {loading ? "Prijava..." : "Prijavi se"}
            </Button>
          </Box>
        </Paper>
      </Box>
      <Footer />
    </>
  );
} 