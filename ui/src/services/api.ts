import { ApiResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL;

export const extractTheme = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(`${API_BASE}/extract-theme`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || json.error);
  }

  return json;
};