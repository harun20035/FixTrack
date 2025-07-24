"use client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const checkToken = () => {
      const exp = localStorage.getItem("auth_token_exp");
      if (exp && Date.now() / 1000 > Number(exp)) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_token_exp");
        router.replace("/login");
      }
    };
    checkToken();
    const interval = setInterval(checkToken, 30000); // check every 30s
    return () => clearInterval(interval);
  }, [router]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 