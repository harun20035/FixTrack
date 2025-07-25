export async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = localStorage.getItem("auth_token");
  const headers = {
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    // Token je istekao ili neispravan
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token_exp");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  return response;
} 