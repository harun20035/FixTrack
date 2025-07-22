"use client"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import ProfileLayout from "./components/ProfileLayout"
import ProfileHeader from "./components/ProfileHeader"
import ProfileForm from "./components/ProfileForm"
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "./types";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Greška prilikom dohvata profila.");
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setError("Greška prilikom dohvata profila.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress color="primary" />
    </Box>
  );
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Nema podataka o profilu.</div>;

  return (
    <ProfileLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ProfileHeader profile={profile} />
          <ProfileForm profile={profile} refetchProfile={fetchProfile} />
        </Box>
      </Container>
    </ProfileLayout>
  );
}
