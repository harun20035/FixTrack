// Mini modal za prikaz poruke o isteku sesije
function showSessionExpiredModal() {
  if (document.getElementById("session-expired-modal")) return;
  const modal = document.createElement("div");
  modal.id = "session-expired-modal";
  modal.style.position = "fixed";
  modal.style.top = "32px";
  modal.style.left = "50%";
  modal.style.transform = "translateX(-50%)";
  modal.style.background = "#222";
  modal.style.color = "#fff";
  modal.style.padding = "16px 32px";
  modal.style.borderRadius = "8px";
  modal.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
  modal.style.zIndex = "9999";
  modal.style.fontSize = "1.1rem";
  modal.style.textAlign = "center";
  modal.textContent = "Vaša sesija je istekla, logujte se ponovo.";
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.remove();
  }, 3500);
}

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
      showSessionExpiredModal();
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    throw new Error("Unauthorized");
  }

  return response;
} 